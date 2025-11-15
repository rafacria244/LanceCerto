import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Função para obter cliente Supabase
const getSupabaseClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase não está configurado');
  }
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

// Função para verificar se é Premium
const checkPremium = async (userId) => {
  const supabase = getSupabaseClient();
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .single();

  if (!subscription || subscription.plan !== 'premium' || subscription.status !== 'active') {
    return { allowed: false, reason: 'Plano Premium necessário' };
  }

  return { allowed: true };
};

// Função para obter instância do Gemini
const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'placeholder_key') {
    return null;
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

// Gerar planejamento do projeto
router.post('/generate-plan', async (req, res) => {
  try {
    const { userId, jobId, profile, jobDescription, proposal, oldProposals } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({ error: 'userId e jobId são obrigatórios' });
    }

    // Verificar se é Premium
    const premiumCheck = await checkPremium(userId);
    if (!premiumCheck.allowed) {
      return res.status(403).json({ 
        error: 'Esta funcionalidade é exclusiva para assinantes Premium',
        code: 'PREMIUM_REQUIRED'
      });
    }

    const genAI = getGenAI();
    if (!genAI) {
      return res.status(500).json({ 
        error: 'API Key do Gemini não configurada. Configure a variável GEMINI_API_KEY no arquivo server/.env' 
      });
    }

    const prompt = `Você é um assistente especializado em planejamento de projetos para freelancers.

Com base nas informações abaixo, crie um planejamento detalhado do projeto em formato JSON estruturado.

Perfil do freelancer: ${profile}
Descrição do job: ${jobDescription}
Proposta enviada: ${proposal}
${oldProposals ? `Propostas antigas (para contexto): ${oldProposals}` : ''}

Crie um planejamento que inclua:

1. Lista de tarefas principais (mínimo 5, máximo 10)
2. Ordem ideal de execução
3. Dicas práticas para cada tarefa
4. Alertas de risco potenciais
5. Sugestões de comunicação com o cliente

Formato de resposta (JSON):
{
  "plan_items": [
    {
      "id": "task_1",
      "title": "Nome da tarefa",
      "description": "Descrição detalhada",
      "order": 1,
      "tips": "Dica prática relacionada",
      "risks": "Alerta de risco se houver"
    }
  ]
}

Retorne APENAS o JSON, sem markdown, sem explicações adicionais.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extrair JSON da resposta
    let planData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSON não encontrado na resposta');
      }
    } catch (parseError) {
      console.error('Erro ao parsear JSON:', parseError);
      return res.status(500).json({ error: 'Erro ao processar resposta da IA' });
    }

    // Salvar no Supabase
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('project_plans')
      .insert({
        user_id: userId,
        job_id: jobId,
        plan_items: planData.plan_items || [],
        completed_items: [],
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar planejamento:', error);
      
      // Verificar se é erro de tabela não encontrada
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        return res.status(500).json({ 
          error: 'Tabela project_plans não encontrada no banco de dados.',
          code: 'TABLE_NOT_FOUND',
          message: 'Execute as migrations do Supabase. Veja o arquivo COMO_EXECUTAR_MIGRATIONS.md para instruções.'
        });
      }
      
      return res.status(500).json({ error: 'Erro ao salvar planejamento', details: error.message });
    }

    res.json({
      id: data.id,
      plan_items: data.plan_items,
      completed_items: data.completed_items,
    });
  } catch (error) {
    console.error('Erro ao gerar planejamento:', error);
    res.status(500).json({ error: 'Erro ao gerar planejamento' });
  }
});

// Atualizar checklist
router.post('/update-checklist', async (req, res) => {
  try {
    const { planId, completedItems } = req.body;

    if (!planId || !Array.isArray(completedItems)) {
      return res.status(400).json({ error: 'planId e completedItems são obrigatórios' });
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('project_plans')
      .update({
        completed_items: completedItems,
        updated_at: new Date().toISOString(),
      })
      .eq('id', planId);

    if (error) {
      console.error('Erro ao atualizar checklist:', error);
      return res.status(500).json({ error: 'Erro ao atualizar checklist' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar checklist:', error);
    res.status(500).json({ error: 'Erro ao atualizar checklist' });
  }
});

// Chat com cliente
router.post('/chat', async (req, res) => {
  try {
    const { userId, jobId, clientMessage, proposal, jobDescription, chatHistory } = req.body;

    if (!userId || !jobId || !clientMessage) {
      return res.status(400).json({ error: 'userId, jobId e clientMessage são obrigatórios' });
    }

    // Verificar se é Premium
    const premiumCheck = await checkPremium(userId);
    if (!premiumCheck.allowed) {
      return res.status(403).json({ 
        error: 'Esta funcionalidade é exclusiva para assinantes Premium',
        code: 'PREMIUM_REQUIRED'
      });
    }

    const genAI = getGenAI();
    if (!genAI) {
      return res.status(500).json({ 
        error: 'API Key do Gemini não configurada. Configure a variável GEMINI_API_KEY no arquivo server/.env' 
      });
    }

    const historyContext = chatHistory && chatHistory.length > 0
      ? `Histórico da conversa:\n${chatHistory.map(h => `${h.from === 'client' ? 'Cliente' : 'Você'}: ${h.message}`).join('\n')}\n\n`
      : '';

    const prompt = `Você é um assistente profissional que ajuda freelancers a responder mensagens de clientes de forma profissional e eficaz.

Contexto do projeto:
- Descrição do job: ${jobDescription}
- Proposta enviada: ${proposal}

${historyContext}

O cliente enviou a seguinte mensagem:
"${clientMessage}"

Gere uma resposta profissional que:
1. Seja empática e respeitosa
2. Demonstre conhecimento do projeto
3. Seja clara e objetiva
4. Mantenha um tom profissional mas amigável
5. Seja útil e construtiva

Responda APENAS com a mensagem para o cliente, sem explicações adicionais, sem prefixos.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const message = response.text().trim();

    // Salvar no Supabase
    const supabase = getSupabaseClient();
    const { error: saveError } = await supabase
      .from('client_dialogs')
      .insert({
        user_id: userId,
        job_id: jobId,
        message_from_client: clientMessage,
        message_from_ia: message,
      });

    if (saveError) {
      console.error('Erro ao salvar diálogo:', saveError);
      
      // Verificar se é erro de tabela não encontrada
      if (saveError.code === 'PGRST205' || saveError.message?.includes('Could not find the table')) {
        return res.status(500).json({ 
          error: 'Tabela client_dialogs não encontrada no banco de dados.',
          code: 'TABLE_NOT_FOUND',
          message: 'Execute as migrations do Supabase. Veja o arquivo COMO_EXECUTAR_MIGRATIONS.md para instruções.'
        });
      }
    }

    res.json({ message });
  } catch (error) {
    console.error('Erro ao gerar resposta:', error);
    res.status(500).json({ error: 'Erro ao gerar resposta' });
  }
});

export default router;

