import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

function SubscriptionInfo() {
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) return null;

  const planNames = {
    free: '🆓 Free',
    starter: '🟩 Starter',
    premium: '🟦 Premium',
  };

  const planLimits = {
    free: 1,
    starter: 30,
    premium: Infinity,
  };

  const limit = planLimits[subscription.plan];
  const remaining = limit === Infinity ? '∞' : Math.max(0, limit - subscription.proposals_count);
  const percentage = limit === Infinity ? 100 : (subscription.proposals_count / limit) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-dark-blue">
            Plano Atual: {planNames[subscription.plan]}
          </h3>
          <p className="text-sm text-gray-600">
            Status: <span className="font-medium text-vibrant-green">{subscription.status === 'active' ? 'Ativo' : 'Inativo'}</span>
          </p>
        </div>
        {subscription.plan === 'free' && (
          <a
            href="/#planos"
            className="text-sm font-medium text-vibrant-green hover:text-green-600 transition-colors"
          >
            Fazer Upgrade →
          </a>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Propostas usadas</span>
          <span className="font-medium text-dark-blue">
            {subscription.proposals_count} / {limit === Infinity ? '∞' : limit}
          </span>
        </div>
        
        {limit !== Infinity && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                percentage >= 90 ? 'bg-red-500' : percentage >= 70 ? 'bg-yellow-500' : 'bg-vibrant-green'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        )}

        {subscription.plan !== 'free' && limit !== Infinity && remaining <= 5 && (
          <p className="text-xs text-red-600 mt-2">
            ⚠️ Você está próximo do limite mensal. Considere fazer upgrade para o plano Premium.
          </p>
        )}

        {subscription.plan === 'free' && subscription.proposals_count >= 1 && (
          <p className="text-xs text-red-600 mt-2">
            ⚠️ Você atingiu o limite do plano Free. Faça upgrade para continuar gerando propostas.
          </p>
        )}
      </div>
    </div>
  );
}

export default SubscriptionInfo;
