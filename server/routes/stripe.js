import express from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Função para verificar se o Stripe está configurado corretamente
const isStripeConfigured = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  return key && 
         key !== 'sk_test_sua_chave_secreta' && 
         key !== 'sk_test_placeholder' &&
         (key.startsWith('sk_test_') || key.startsWith('sk_live_')) &&
         key.length > 20;
};

// Função para validar se um Price ID está no formato correto
const isValidPriceId = (priceId) => {
  return priceId && priceId.startsWith('price_') && priceId.length > 10;
};

// Função para obter instância do Stripe (apenas se configurado)
const getStripe = () => {
  if (!isStripeConfigured()) {
    throw new Error('Stripe não está configurado. Configure STRIPE_SECRET_KEY no arquivo server/.env');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// Validar se a API key do Stripe está configurada (apenas aviso, não bloqueia)
if (!isStripeConfigured()) {
  console.warn('⚠️  AVISO: STRIPE_SECRET_KEY não está configurada corretamente no arquivo server/.env');
  console.warn('O app funcionará, mas funcionalidades de pagamento estarão desabilitadas.');
  console.warn('Para habilitar pagamentos, configure uma chave válida do Stripe.');
  console.warn('Obtenha sua chave em: https://dashboard.stripe.com/apikeys');
}

// Função para obter cliente Supabase (criado apenas quando necessário)
const getSupabaseClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase não está configurado. Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo server/.env');
  }
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

// Criar portal session para gerenciar assinatura
router.post('/create-portal-session', async (req, res) => {
  try {
    // Verificar se o Stripe está configurado
    if (!isStripeConfigured()) {
      return res.status(503).json({ 
        error: 'Funcionalidade de pagamento não está disponível. O Stripe não está configurado.',
        code: 'STRIPE_NOT_CONFIGURED'
      });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    // Buscar subscription do usuário
    const supabase = getSupabaseClient();
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .single();

    if (!subscription?.stripe_subscription_id) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    const stripe = getStripe();
    
    // Buscar customer do Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
    const customerId = stripeSubscription.customer;

    // Criar portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/gerar`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar portal session:', error);
    
    if (error.message.includes('Stripe não está configurado')) {
      return res.status(503).json({ 
        error: 'Funcionalidade de pagamento não está disponível.',
        code: 'STRIPE_NOT_CONFIGURED'
      });
    }
    
    res.status(500).json({ 
      error: 'Erro ao criar sessão do portal',
      message: error.message 
    });
  }
});

// Criar sessão de checkout
router.post('/create-checkout-session', async (req, res) => {
  try {
    // Verificar se o Stripe está configurado
    if (!isStripeConfigured()) {
      return res.status(503).json({ 
        error: 'Funcionalidade de pagamento não está disponível. O Stripe não está configurado.',
        code: 'STRIPE_NOT_CONFIGURED',
        message: 'Por favor, configure suas credenciais do Stripe no arquivo server/.env. Veja o GUIA_CONFIGURACAO.md para instruções.'
      });
    }

    const { priceId, userId } = req.body;

    if (!priceId || !userId) {
      return res.status(400).json({ error: 'priceId e userId são obrigatórios' });
    }

    // Validar formato do Price ID
    if (!isValidPriceId(priceId)) {
      return res.status(400).json({ 
        error: 'Price ID inválido. O Price ID deve começar com "price_" e não com "prod_".',
        code: 'INVALID_PRICE_ID',
        message: 'Você está usando um Product ID ao invés de um Price ID. No Stripe Dashboard, vá em Products > [Seu Produto] > Pricing e copie o Price ID (começa com price_).'
      });
    }

    const stripe = getStripe();
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/gerar?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Erro ao criar checkout session:', error);
    
    // Tratar erros específicos do Stripe
    if (error.type === 'StripeAuthenticationError') {
      return res.status(503).json({ 
        error: 'Chave de API do Stripe inválida. Verifique a configuração no arquivo server/.env',
        code: 'STRIPE_AUTH_ERROR'
      });
    }
    
    if (error.type === 'StripeInvalidRequestError' && error.code === 'resource_missing') {
      // Erro quando o Price ID não existe ou está incorreto
      if (error.raw?.param === 'line_items[0][price]') {
        return res.status(400).json({ 
          error: 'Price ID não encontrado no Stripe.',
          code: 'PRICE_NOT_FOUND',
          message: 'O Price ID informado não existe na sua conta do Stripe. Verifique se você está usando o Price ID correto (começa com price_) e se está no modo de teste correto (test/live).'
        });
      }
    }
    
    if (error.message.includes('Stripe não está configurado')) {
      return res.status(503).json({ 
        error: 'Funcionalidade de pagamento não está disponível.',
        code: 'STRIPE_NOT_CONFIGURED'
      });
    }
    
    res.status(500).json({ 
      error: 'Erro ao criar sessão de checkout',
      message: error.message,
      code: error.type || 'UNKNOWN_ERROR'
    });
  }
});

// Webhook do Stripe (raw body parser já aplicado no index.js)
router.post('/webhook', async (req, res) => {
  // Verificar se o Stripe está configurado antes de processar webhook
  if (!isStripeConfigured()) {
    console.warn('Webhook do Stripe recebido, mas Stripe não está configurado');
    return res.status(503).json({ 
      error: 'Stripe não está configurado',
      code: 'STRIPE_NOT_CONFIGURED'
    });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const stripe = getStripe();
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;

        if (userId && session.subscription) {
          // Buscar detalhes da subscription para obter o price_id
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          const priceId = subscription.items.data[0]?.price?.id;
          
          let plan = 'free';
          if (priceId === process.env.STRIPE_PRICE_STARTER) {
            plan = 'starter';
          } else if (priceId === process.env.STRIPE_PRICE_PREMIUM) {
            plan = 'premium';
          }

          // Atualizar ou criar subscription no Supabase
          const supabase = getSupabaseClient();
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_subscription_id: session.subscription,
              plan,
              status: 'active',
              proposals_count: 0,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            }, {
              onConflict: 'user_id',
            });

          if (error) {
            console.error('Erro ao atualizar subscription:', error);
          }
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Buscar subscription no Supabase pelo stripe_subscription_id
        const supabase = getSupabaseClient();
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (existingSub) {
          const status = event.type === 'customer.subscription.deleted' ? 'canceled' : subscription.status;
          
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('user_id', existingSub.user_id);

          if (error) {
            console.error('Erro ao atualizar subscription:', error);
          }
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});

export default router;
