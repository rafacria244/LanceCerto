import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ExportButtons({ proposta, jobId }) {
  const { user } = useAuth();
  const [exporting, setExporting] = useState(null);

  const formatDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const formatFileName = (extension) => {
    const date = formatDate();
    const id = jobId || 'proposta';
    return `proposta-${date}-${id}.${extension}`;
  };

  const handleExportPDF = async () => {
    if (!proposta) return;
    
    setExporting('pdf');
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: proposta,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = formatFileName('pdf');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar PDF. Tente novamente.');
    } finally {
      setExporting(null);
    }
  };

  const handleExportDOCX = async () => {
    if (!proposta) return;
    
    setExporting('docx');
    try {
      const response = await fetch('/api/export/docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: proposta,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar DOCX');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = formatFileName('docx');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar DOCX:', error);
      alert('Erro ao exportar DOCX. Tente novamente.');
    } finally {
      setExporting(null);
    }
  };

  const handleExportTXT = () => {
    if (!proposta) return;
    
    setExporting('txt');
    try {
      const blob = new Blob([proposta], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = formatFileName('txt');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar TXT:', error);
      alert('Erro ao exportar TXT. Tente novamente.');
    } finally {
      setExporting(null);
    }
  };

  const handleCopy = async () => {
    if (!proposta) return;
    
    try {
      await navigator.clipboard.writeText(proposta);
      alert('Proposta copiada para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('Erro ao copiar. Tente novamente.');
    }
  };

  if (!proposta) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button
        onClick={handleExportPDF}
        disabled={exporting === 'pdf'}
        className="flex items-center gap-2 bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {exporting === 'pdf' ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Gerando...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Exportar PDF
          </>
        )}
      </button>

      <button
        onClick={handleExportDOCX}
        disabled={exporting === 'docx'}
        className="flex items-center gap-2 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {exporting === 'docx' ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Gerando...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar DOCX
          </>
        )}
      </button>

      <button
        onClick={handleExportTXT}
        disabled={exporting === 'txt'}
        className="flex items-center gap-2 bg-gray-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {exporting === 'txt' ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Gerando...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar TXT
          </>
        )}
      </button>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 bg-vibrant-green text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copiar para Área de Transferência
      </button>
    </div>
  );
}

export default ExportButtons;

