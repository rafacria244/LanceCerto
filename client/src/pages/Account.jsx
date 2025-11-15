import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import ManageSubscription from '../components/ManageSubscription';

function Account() {
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

  const planNames = {
    free: '🆓 Free',
    starter: '🟩 Starter',
    premium: '🟦 Premium',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-green"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl font-bold text-dark-blue mb-8">Minha Conta</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-dark-blue mb-4">Informações da Conta</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>ID do Usuário:</strong> {user?.id}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-dark-blue mb-4">Assinatura</h2>
          {subscription ? (
            <div className="space-y-4">
              <div>
                <p><strong>Plano Atual:</strong> {planNames[subscription.plan] || subscription.plan}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 font-medium ${
                    subscription.status === 'active' ? 'text-vibrant-green' : 'text-red-600'
                  }`}>
                    {subscription.status === 'active' ? 'Ativo' : subscription.status}
                  </span>
                </p>
                {subscription.current_period_end && (
                  <p><strong>Próxima Renovação:</strong> {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}</p>
                )}
              </div>
              <ManageSubscription />
            </div>
          ) : (
            <p className="text-gray-600">Nenhuma assinatura encontrada.</p>
          )}
        </div>

        {subscription?.plan !== 'premium' && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-md p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">⭐ Upgrade para Premium</h2>
            <p className="mb-4">Desbloqueie recursos exclusivos como planejamento de projetos com IA e assistente de comunicação.</p>
            <a
              href="/#planos"
              className="inline-block bg-white text-purple-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Fazer Upgrade
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;

