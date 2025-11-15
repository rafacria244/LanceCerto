import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import ProposalForm from '../components/ProposalForm';
import ResultCard from '../components/ResultCard';
import SubscriptionInfo from '../components/SubscriptionInfo';

function Generate() {
  const { user } = useAuth();
  const [proposta, setProposta] = useState('');
  const [jobId, setJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateProposal = async (formData) => {
    setLoading(true);
    setError('');
    setProposta('');
    setJobId(null);

    try {
      const response = await axios.post('/api/gerar-lance', {
        ...formData,
        userId: user.id,
      });
      setProposta(response.data.proposta);
      setJobId(response.data.jobId);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao gerar proposta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl font-bold text-dark-blue mb-8">Gerar Nova Proposta</h1>
        <SubscriptionInfo />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProposalForm 
            onSubmit={handleGenerateProposal} 
            loading={loading}
          />
          <ResultCard 
            proposta={proposta}
            loading={loading}
            error={error}
            jobId={jobId}
          />
        </div>
      </div>
    </div>
  );
}

export default Generate;

