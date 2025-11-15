import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import axios from 'axios';

function Premium() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('planning'); // 'planning' ou 'chat'
  
  // Estados para Planejamento
  const [planningLoading, setPlanningLoading] = useState(false);
  const [planItems, setPlanItems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobs, setJobs] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  
  // Estados para Chat
  const [chatLoading, setChatLoading] = useState(false);
  const [clientMessage, setClientMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedJobForChat, setSelectedJobForChat] = useState('');

  useEffect(() => {
    if (user) {
      checkSubscription();
      fetchJobs();
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data.plan !== 'premium' || data.status !== 'active') {
        alert('Esta funcionalidade é exclusiva para assinantes Premium. Faça upgrade para acessar.');
        navigate('/gerar');
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      alert('Erro ao verificar assinatura. Tente novamente.');
      navigate('/gerar');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, job_description, generated_proposal, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Erro ao buscar jobs:', error);
    }
  };

  const handleGeneratePlan = async () => {
    if (!selectedJobId) {
      alert('Selecione um projeto primeiro');
      return;
    }

    setPlanningLoading(true);
    try {
      const selectedJob = jobs.find(j => j.id === selectedJobId);
      if (!selectedJob) {
        throw new Error('Projeto não encontrado');
      }

      // Buscar perfil do usuário e propostas antigas
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: oldJobs } = await supabase
        .from('jobs')
        .select('generated_proposal')
        .eq('user_id', user.id)
        .neq('id', selectedJobId)
        .limit(3);

      const response = await axios.post('/api/premium/generate-plan', {
        userId: user.id,
        jobId: selectedJobId,
        profile: profileData?.full_name || 'Freelancer',
        jobDescription: selectedJob.job_description,
        proposal: selectedJob.generated_proposal,
        oldProposals: oldJobs?.map(j => j.generated_proposal).join('\n\n') || '',
      });

      const planData = response.data;
      setPlanItems(planData.plan_items || []);
      setCompletedItems([]);
      setCurrentPlan({ id: planData.id, job_id: selectedJobId });
    } catch (error) {
      console.error('Erro ao gerar planejamento:', error);
      const errorData = error.response?.data;
      
      if (errorData?.code === 'TABLE_NOT_FOUND') {
        alert(`⚠️ ${errorData.error}\n\n${errorData.message}\n\nO arquivo de migration está em: server/migrations-premium-tables.sql`);
      } else {
        alert(errorData?.error || errorData?.message || 'Erro ao gerar planejamento. Tente novamente.');
      }
    } finally {
      setPlanningLoading(false);
    }
  };

  const handleToggleItem = async (itemIndex) => {
    const itemId = planItems[itemIndex]?.id || itemIndex;
    const isCompleted = completedItems.includes(itemId);
    
    const newCompleted = isCompleted
      ? completedItems.filter(id => id !== itemId)
      : [...completedItems, itemId];

    setCompletedItems(newCompleted);

    if (currentPlan?.id) {
      try {
        await axios.post('/api/premium/update-checklist', {
          planId: currentPlan.id,
          completedItems: newCompleted,
        });
      } catch (error) {
        console.error('Erro ao atualizar checklist:', error);
      }
    }
  };

  const handleChat = async () => {
    if (!clientMessage.trim() || !selectedJobForChat) {
      alert('Digite uma mensagem e selecione um projeto');
      return;
    }

    setChatLoading(true);
    try {
      const selectedJob = jobs.find(j => j.id === selectedJobForChat);
      if (!selectedJob) {
        throw new Error('Projeto não encontrado');
      }

      const response = await axios.post('/api/premium/chat', {
        userId: user.id,
        jobId: selectedJobForChat,
        clientMessage: clientMessage,
        proposal: selectedJob.generated_proposal,
        jobDescription: selectedJob.job_description,
        chatHistory: chatHistory.slice(-5), // Últimas 5 mensagens
      });

      const newMessage = {
        from: 'client',
        message: clientMessage,
      };
      const newResponse = {
        from: 'ia',
        message: response.data.message,
      };

      setChatHistory([...chatHistory, newMessage, newResponse]);
      setClientMessage('');
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      const errorData = error.response?.data;
      
      if (errorData?.code === 'TABLE_NOT_FOUND') {
        alert(`⚠️ ${errorData.error}\n\n${errorData.message}\n\nO arquivo de migration está em: server/migrations-premium-tables.sql`);
      } else {
        alert(errorData?.error || errorData?.message || 'Erro ao gerar resposta. Tente novamente.');
      }
    } finally {
      setChatLoading(false);
    }
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-dark-blue">Painel Premium</h1>
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              ⭐ VIP
            </span>
          </div>
          <p className="text-gray-600">Acesso exclusivo a ferramentas avançadas de planejamento e comunicação</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('planning')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'planning'
                ? 'text-vibrant-green border-b-2 border-vibrant-green'
                : 'text-gray-600 hover:text-dark-blue'
            }`}
          >
            📋 Planejamento do Projeto
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'chat'
                ? 'text-vibrant-green border-b-2 border-vibrant-green'
                : 'text-gray-600 hover:text-dark-blue'
            }`}
          >
            💬 Conversa com o Cliente
          </button>
        </div>

        {/* Conteúdo do Planejamento */}
        {activeTab === 'planning' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-dark-blue mb-4">Planejamento do Projeto</h2>
              <div className="flex gap-4 mb-4">
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-vibrant-green"
                >
                  <option value="">Selecione um projeto...</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.job_description.substring(0, 50)}... - {new Date(job.created_at).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleGeneratePlan}
                  disabled={planningLoading || !selectedJobId}
                  className="bg-vibrant-green text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {planningLoading ? 'Gerando...' : 'Iniciar Planejamento'}
                </button>
              </div>
            </div>

            {planItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-dark-blue">Checklist do Projeto</h3>
                {planItems.map((item, index) => {
                  const itemId = item.id || index;
                  const isCompleted = completedItems.includes(itemId);
                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 ${
                        isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleItem(index)}
                          className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            isCompleted
                              ? 'bg-vibrant-green border-vibrant-green'
                              : 'border-gray-300'
                          }`}
                        >
                          {isCompleted && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <div className="flex-1">
                          <h4 className="font-semibold text-dark-blue mb-1">{item.title || item.task}</h4>
                          {item.description && (
                            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          )}
                          {item.tips && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                              <p className="text-sm text-blue-800"><strong>💡 Dica:</strong> {item.tips}</p>
                            </div>
                          )}
                          {item.risks && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                              <p className="text-sm text-yellow-800"><strong>⚠️ Alerta:</strong> {item.risks}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Conteúdo do Chat */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-dark-blue mb-4">Conversa com o Cliente</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o projeto:
              </label>
              <select
                value={selectedJobForChat}
                onChange={(e) => {
                  setSelectedJobForChat(e.target.value);
                  setChatHistory([]);
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-vibrant-green"
              >
                <option value="">Selecione um projeto...</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.job_description.substring(0, 50)}... - {new Date(job.created_at).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diálogo do cliente:
              </label>
              <textarea
                value={clientMessage}
                onChange={(e) => setClientMessage(e.target.value)}
                placeholder="Cole aqui a mensagem do cliente..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-vibrant-green"
              />
            </div>

            <button
              onClick={handleChat}
              disabled={chatLoading || !clientMessage.trim() || !selectedJobForChat}
              className="bg-vibrant-green text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              {chatLoading ? 'Gerando Resposta...' : 'Gerar Resposta'}
            </button>

            {chatHistory.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="text-xl font-semibold text-dark-blue">Histórico da Conversa</h3>
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 ${
                      msg.from === 'client'
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-green-50 border border-green-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-dark-blue">
                        {msg.from === 'client' ? '👤 Cliente:' : '🤖 IA:'}
                      </span>
                      <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Premium;

