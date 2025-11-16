import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { proposalLimiter, apiLimiter, webhookLimiter } from './middleware/rateLimiter.js';
import { validateProposalInput } from './middleware/validation.js';
import { requestLogger, errorLogger } from './middleware/requestLogger.js';
import logger from './config/logger.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import stripeRoutes from './routes/stripe.js';
import exportRoutes from './routes/export.js';
import premiumRoutes from './routes/premium.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Segurança com Helmet
app.use(helmet());

// CORS
app.use(cors());

// Request logging
app.use(requestLogger);

// Rate limiting geral para API
app.use('/api', apiLimiter);

// Webhook do Stripe precisa do raw body
app.use('/api/webhook', express.raw({ type: 'application/json' }));

// Para todas as outras rotas, usar JSON parser
app.use(express.json());

// Inicializar Supabase (apenas se as variáveis estiverem configuradas)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
} else {
  console.warn('⚠️  AVISO: Supabase não está configurado. Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo server/.env');
}

// Rotas do Stripe (webhook já tem seu próprio parser)
app.use('/api', stripeRoutes);

// Rotas de exportação
app.use('/api/export', exportRoutes);

// Rotas Premium
app.use('/api/premium', premiumRoutes);

// Inicializar Gemini (só será usado quando houver requisição)
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'placeholder_key') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

app.post('/api/gerar-lance', proposalLimiter, validateProposalInput, async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({ 
        error: 'API Key do Gemini não configurada. Configure a variável GEMINI_API_KEY no arquivo .env' 
      });
    }

    const { perfil, propostas_antigas, descricao_job, userId } = req.body;

    // Verificar autenticação
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Verificar plano e limites
    if (!supabase) {
      return res.status(500).json({ 
        error: 'Supabase não está configurado. Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo server/.env' 
      });
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, proposals_count, current_period_end')
      .eq('user_id', userId)
      .single();

    const plan = subscription?.plan || 'free';
    const proposalsCount = subscription?.proposals_count || 0;

    // Verificar limites
    if (plan === 'free' && proposalsCount >= 1) {
      return res.status(403).json({ 
        error: 'Limite de propostas do plano Free atingido. Faça upgrade para continuar.' 
      });
    }

    if (plan === 'starter' && proposalsCount >= 30) {
      // Verificar se está no novo período
      const periodEnd = subscription.current_period_end 
        ? new Date(subscription.current_period_end) 
        : null;
      const now = new Date();
      
      if (periodEnd && now < periodEnd) {
        return res.status(403).json({ 
          error: 'Limite de 30 propostas/mês do plano Starter atingido. Faça upgrade para Premium.' 
        });
      } else if (periodEnd && now >= periodEnd) {
        // Resetar contador no novo período
        await supabase
          .from('subscriptions')
          .update({ proposals_count: 0 })
          .eq('user_id', userId);
      }
    }

    if (!perfil || !descricao_job) {
      return res.status(400).json({ 
        error: 'Perfil e descrição do job são obrigatórios' 
      });
    }

    // Construir o prompt para a IA
    const prompt = `Você é um assistente especializado em gerar propostas comerciais de freelancers.
Com base nas informações abaixo, escreva uma proposta clara, persuasiva e profissional.

Perfil do freelancer:
${perfil}

${propostas_antigas ? `Estilo (propostas antigas do usuário):
${propostas_antigas}` : ''}

Descrição do job:
${descricao_job}

Crie uma proposta que:

- Mostre empatia com o cliente
- Destaque as habilidades do freelancer de forma natural
- Seja curta, impactante e sem floreios
- Termine com uma chamada para ação (CTA)

Formato final:

- Saudação personalizada
- 2 parágrafos de apresentação
- 1 parágrafo explicando como o freelancer resolverá o problema
- Encerramento com frase de impacto e CTA ("Vamos conversar?", "Podemos começar ainda hoje?", etc.)`;

    // Obter o modelo Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Gerar conteúdo
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const proposta = response.text();

    // Salvar proposta no banco
    let jobId = null;
    if (supabase) {
      const { data: jobData, error: saveError } = await supabase
        .from('jobs')
        .insert({
          user_id: userId,
          profile: perfil,
          old_proposals: propostas_antigas || null,
          job_description: descricao_job,
          generated_proposal: proposta,
        })
        .select('id')
        .single();

      if (saveError) {
        console.error('Erro ao salvar proposta:', saveError);
      } else {
        jobId = jobData?.id;
      }

      // Atualizar contador de propostas
      await supabase
        .from('subscriptions')
        .update({ proposals_count: proposalsCount + 1 })
        .eq('user_id', userId);
    }

    res.json({ proposta, jobId });
  } catch (error) {
    console.error('Erro ao gerar proposta:', error);
    res.status(500).json({ 
      error: 'Erro ao gerar proposta. Tente novamente.' 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LanceCerto API está funcionando' });
});

// Error logging middleware
app.use(errorLogger);

const server = app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Erro: Porta ${PORT} já está em uso.`);
    console.error('💡 Solução: Feche outros processos usando a porta 3001 ou altere a porta no arquivo server/.env');
    console.error('   Para ver processos na porta 3001: netstat -ano | findstr :3001');
    console.error('   Para matar um processo: taskkill /F /PID <numero>');
    process.exit(1);
  } else {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  }
});

