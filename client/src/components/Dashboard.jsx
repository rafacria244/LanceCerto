import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProposals: 0,
    thisMonthProposals: 0,
    remainingProposals: 0,
  });
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Buscar subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setSubscription(subData);

      // Buscar total de propostas
      const { count: totalCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Buscar propostas deste mês
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());

      // Calcular propostas restantes
      let remaining = 0;
      if (subData?.plan === 'free') {
        remaining = Math.max(0, 1 - (subData.proposals_count || 0));
      } else if (subData?.plan === 'starter') {
        remaining = Math.max(0, 30 - (subData.proposals_count || 0));
      } else if (subData?.plan === 'premium') {
        remaining = Infinity;
      }

      setStats({
        totalProposals: totalCount || 0,
        thisMonthProposals: monthCount || 0,
        remainingProposals: remaining,
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const planLimits = {
    free: 1,
    starter: 30,
    premium: Infinity,
  };

  const planNames = {
    free: 'Free',
    starter: 'Starter',
    premium: 'Premium',
  };

  const getProgressPercentage = () => {
    if (!subscription) return 0;
    const limit = planLimits[subscription.plan];
    if (limit === Infinity) return 100;
    const used = subscription.proposals_count || 0;
    return Math.min((used / limit) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibrant-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Propostas</p>
              <p className="text-3xl font-bold text-dark-blue">{stats.totalProposals}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Este Mês</p>
              <p className="text-3xl font-bold text-vibrant-green">{stats.thisMonthProposals}</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Propostas Restantes</p>
              <p className="text-3xl font-bold text-purple-600">
                {stats.remainingProposals === Infinity ? '∞' : stats.remainingProposals}
              </p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </div>
      </div>

      {/* Informações do Plano */}
      {subscription && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Plano {planNames[subscription.plan]}
              </h3>
              <p className="text-blue-100">
                Status: {subscription.status === 'active' ? 'Ativo ✓' : subscription.status}
              </p>
              {subscription.current_period_end && subscription.plan !== 'free' && (
                <p className="text-blue-100 text-sm mt-1">
                  Renova em: {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            {subscription.plan !== 'premium' && (
              <a
                href="/#planos"
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
              >
                Fazer Upgrade
              </a>
            )}
          </div>

          {/* Barra de Progresso */}
          {subscription.plan !== 'premium' && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Uso no período</span>
                <span>
                  {subscription.proposals_count || 0} / {planLimits[subscription.plan]}
                </span>
              </div>
              <div className="w-full bg-blue-300 rounded-full h-3">
                <div
                  className="bg-white rounded-full h-3 transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
