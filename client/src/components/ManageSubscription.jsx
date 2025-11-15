import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

function ManageSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Erro ao buscar subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    // Redirecionar para o portal de gerenciamento do Stripe
    // Isso requer uma rota adicional no backend
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = await response.json();

      // Verificar se há erro de configuração do Stripe
      if (!response.ok) {
        if (data.code === 'STRIPE_NOT_CONFIGURED' || data.code === 'STRIPE_AUTH_ERROR') {
          alert('Funcionalidade de pagamento temporariamente indisponível. Por favor, entre em contato com o suporte.');
          return;
        }
        throw new Error(data.error || 'Erro ao acessar portal');
      }

      const { url } = data;
      
      if (!url) {
        throw new Error('URL do portal não foi retornada');
      }
      
      window.location.href = url;
    } catch (error) {
      console.error('Erro ao acessar portal:', error);
      alert(error.message || 'Erro ao acessar portal de gerenciamento. Tente novamente.');
    }
  };

  if (loading) return null;
  if (!subscription || subscription.plan === 'free') return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-dark-blue mb-4">
        Gerenciar Assinatura
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Atualize seu método de pagamento, visualize faturas ou cancele sua assinatura.
      </p>
      <button
        onClick={handleManageSubscription}
        className="bg-dark-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        Acessar Portal de Gerenciamento
      </button>
    </div>
  );
}

export default ManageSubscription;
