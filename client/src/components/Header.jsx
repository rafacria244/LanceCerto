import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import logo from '../assets/logo.png';

function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', user.id)
        .single();
      setSubscription(data);
    } catch (error) {
      console.error('Erro ao buscar subscription:', error);
    }
  };

  const isPremium = subscription?.plan === 'premium' && subscription?.status === 'active';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="LanceCerto" className="h-10" />
            <span className="text-dark-blue font-bold text-xl">LanceCerto.ai</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link 
                  to="/gerar" 
                  className="text-dark-blue hover:text-vibrant-green transition-colors font-medium"
                >
                  Gerar Proposta
                </Link>
                <Link 
                  to="/historico" 
                  className="text-dark-blue hover:text-vibrant-green transition-colors font-medium"
                >
                  Histórico
                </Link>
                {isPremium && (
                  <Link 
                    to="/premium" 
                    className="text-dark-blue hover:text-vibrant-green transition-colors font-medium flex items-center gap-1"
                  >
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                      ⭐
                    </span>
                    Painel Premium
                  </Link>
                )}
                <Link 
                  to="/conta" 
                  className="text-dark-blue hover:text-vibrant-green transition-colors font-medium"
                >
                  Minha Conta
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-dark-blue transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-dark-blue hover:text-vibrant-green transition-colors font-medium"
                >
                  Entrar
                </Link>
                <Link
                  to="/login"
                  className="bg-vibrant-green text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

