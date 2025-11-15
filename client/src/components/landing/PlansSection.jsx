import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

function PlansSection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(null);

  const handleCheckout = async (priceId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoading(priceId);
    try {
      // Criar sessão de checkout no Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
        }),
      });

      const data = await response.json();

      // Verificar se há erro de configuração do Stripe
      if (!response.ok) {
        if (data.code === 'STRIPE_NOT_CONFIGURED' || data.code === 'STRIPE_AUTH_ERROR') {
          alert('Funcionalidade de pagamento temporariamente indisponível. Por favor, entre em contato com o suporte.');
          setLoading(null);
          return;
        }
        
        if (data.code === 'INVALID_PRICE_ID' || data.code === 'PRICE_NOT_FOUND') {
          alert(data.message || data.error || 'Price ID inválido. Verifique a configuração do Stripe.');
          setLoading(null);
          return;
        }
        
        throw new Error(data.message || data.error || 'Erro ao criar sessão de checkout');
      }

      const { sessionId } = data;
      
      if (!sessionId) {
        throw new Error('Sessão de checkout não foi criada');
      }
      
      // Redirecionar para Stripe Checkout
      const stripe = window.Stripe?.(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      } else {
        throw new Error('Stripe não está disponível no navegador');
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      alert(error.message || 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: 'Gratuito',
      priceValue: 0,
      proposals: '1 proposta gerada',
      features: [
        'Geração de proposta comercial com IA',
        'Personalização básica com biografia',
        'Acesso ao histórico de propostas',
        'Exportação em texto',
      ],
      ideal: 'Testar a plataforma e ver como funciona',
      buttonText: 'Começar Grátis',
      buttonAction: () => window.location.href = user ? '/gerar' : '/login',
      stripePriceId: null,
    },
    {
      name: 'Starter',
      price: 'R$ 49,99',
      priceValue: 49.99,
      period: 'por mês',
      proposals: 'Ilimitadas',
      subtitle: 'Para freelancers ativos',
      features: [
        'Projetos ilimitados',
        'Geração avançada de propostas',
        'Histórico de propostas',
        'Suporte prioritário',
      ],
      ideal: 'Freelancers ativos que precisam gerar propostas regularmente',
      buttonText: 'Assinar Starter',
      buttonAction: () => handleCheckout(import.meta.env.VITE_STRIPE_PRICE_STARTER),
      stripePriceId: import.meta.env.VITE_STRIPE_PRICE_STARTER,
      popular: true,
    },
    {
      name: 'Premium',
      price: 'R$ 99,99',
      priceValue: 99.99,
      period: 'por mês',
      proposals: 'Ilimitadas',
      subtitle: 'Para profissionais sérios',
      features: [
        'Tudo do Starter +',
        'IA cria plano de execução do projeto',
        'Dicas valiosas personalizadas',
        'Análise de competitividade',
        'Suporte VIP 24/7',
      ],
      ideal: 'Profissionais sérios que precisam de planejamento completo e suporte avançado',
      buttonText: 'Assinar Premium',
      buttonAction: () => handleCheckout(import.meta.env.VITE_STRIPE_PRICE_PREMIUM),
      stripePriceId: import.meta.env.VITE_STRIPE_PRICE_PREMIUM,
      vip: true,
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4">
            Escolha seu Plano
          </h2>
          <p className="text-lg text-gray-600">
            Planos flexíveis para todos os tipos de freelancers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg p-8 border-2 ${
                plan.popular
                  ? 'border-vibrant-green transform scale-105'
                  : 'border-gray-200'
              } relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-vibrant-green text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}
              {plan.vip && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐ VIP
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-dark-blue mb-2">
                  {plan.name === 'Free' && '🆓 '}
                  {plan.name === 'Starter' && '🟩 '}
                  {plan.name === 'Premium' && '🟦 '}
                  {plan.name}
                </h3>
                {plan.subtitle && (
                  <p className="text-sm text-gray-600 mb-3 italic">{plan.subtitle}</p>
                )}
                <div className="mt-4">
                  <span className="text-4xl font-bold text-dark-blue">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">{plan.proposals}</p>
              </div>

              <ul className="space-y-3 mb-8 min-h-[200px]">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-vibrant-green font-bold mt-1">✓</span>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-6">
                <p className="text-xs text-gray-500 italic text-center">
                  Ideal para: {plan.ideal}
                </p>
              </div>

              <button
                onClick={plan.buttonAction}
                disabled={loading === plan.stripePriceId}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors ${
                  plan.popular
                    ? 'bg-vibrant-green text-white hover:bg-green-600'
                    : plan.name === 'Free'
                    ? 'bg-light-gray text-dark-blue hover:bg-gray-200'
                    : 'bg-dark-blue text-white hover:bg-blue-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.stripePriceId ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processando...
                  </span>
                ) : (
                  plan.buttonText
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PlansSection;

