import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

function History() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Proposta copiada para a área de transferência!');
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl font-bold text-dark-blue mb-8">Histórico de Propostas</h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-green"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">Você ainda não gerou nenhuma proposta.</p>
            <a
              href="/gerar"
              className="inline-block bg-vibrant-green text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Gerar Primeira Proposta
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de propostas */}
            <div className="lg:col-span-1 space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedJob?.id === job.id ? 'ring-2 ring-vibrant-green' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-dark-blue text-sm line-clamp-2">
                      {job.job_description.substring(0, 60)}...
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500">{formatDate(job.created_at)}</p>
                </div>
              ))}
            </div>

            {/* Detalhes da proposta selecionada */}
            <div className="lg:col-span-2">
              {selectedJob ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-dark-blue">Detalhes da Proposta</h2>
                    <button
                      onClick={() => copyToClipboard(selectedJob.generated_proposal)}
                      className="bg-vibrant-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      📋 Copiar
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Descrição do Job:</h3>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                        {selectedJob.job_description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Proposta Gerada:</h3>
                      <div className="text-sm text-gray-800 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap leading-relaxed">
                        {selectedJob.generated_proposal}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 pt-4 border-t">
                      Gerada em: {formatDate(selectedJob.created_at)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-600">Selecione uma proposta para ver os detalhes</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
