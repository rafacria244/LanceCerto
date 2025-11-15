import { useState } from 'react';

function ProposalForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    perfil: '',
    propostas_antigas: '',
    descricao_job: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-dark-blue mb-6">
        Gerar Nova Proposta
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="perfil" 
            className="block text-sm font-semibold text-dark-blue mb-2"
          >
            Seu Perfil <span className="text-red-500">*</span>
          </label>
          <textarea
            id="perfil"
            name="perfil"
            value={formData.perfil}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Cole aqui sua biografia ou resumo profissional. Ex: Sou desenvolvedor full-stack com 5 anos de experiência em React e Node.js..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-green focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label 
            htmlFor="propostas_antigas" 
            className="block text-sm font-semibold text-dark-blue mb-2"
          >
            Propostas Antigas <span className="text-gray-400 text-xs">(opcional)</span>
          </label>
          <textarea
            id="propostas_antigas"
            name="propostas_antigas"
            value={formData.propostas_antigas}
            onChange={handleChange}
            rows={4}
            placeholder="Cole aqui exemplos de propostas que você já enviou. Isso ajuda a IA a aprender seu estilo de escrita."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-green focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label 
            htmlFor="descricao_job" 
            className="block text-sm font-semibold text-dark-blue mb-2"
          >
            Descrição do Job <span className="text-red-500">*</span>
          </label>
          <textarea
            id="descricao_job"
            name="descricao_job"
            value={formData.descricao_job}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Cole aqui a descrição do projeto (do Workana, 99Freelas, Upwork, etc.)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-green focus:border-transparent resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-vibrant-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gerando proposta...
            </>
          ) : (
            '🚀 Gerar Lance'
          )}
        </button>
      </form>
    </div>
  );
}

export default ProposalForm;

