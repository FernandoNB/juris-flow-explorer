
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ProcessoEncontrado } from '@/types/monitoramento';
import { formatDate, cleanHtmlTags, consultarProcesso } from '@/utils/monitoramentoUtils';

interface ProcessosResultsProps {
  processos: ProcessoEncontrado[];
  loadingResults: boolean;
}

const ProcessosResults: React.FC<ProcessosResultsProps> = ({ processos, loadingResults }) => {
  if (loadingResults) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Carregando resultados...</p>
      </div>
    );
  }

  if (processos.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Nenhum processo encontrado
        </h3>
        <p className="text-slate-600">
          Este monitoramento ainda não encontrou novos processos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">
        Processos Encontrados ({processos.length})
      </h2>
      
      <div className="space-y-4">
        {processos.map((processo, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {processo.numero_cnj}
                </h3>
                <div className="space-y-1 text-sm text-slate-600">
                  <p><strong>Tribunal:</strong> {processo.tribunal}</p>
                  <p><strong>Estado:</strong> {processo.estado_origem.nome} ({processo.estado_origem.sigla})</p>
                  <p><strong>Data de Início:</strong> {formatDate(processo.data_inicio)}</p>
                  <p><strong>Conteúdo:</strong> {cleanHtmlTags(processo.match)}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => consultarProcesso(processo.numero_cnj, 'detalhes')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  Ver Detalhes
                </button>
                <button
                  onClick={() => consultarProcesso(processo.numero_cnj, 'movimentacoes')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                >
                  Movimentações
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessosResults;
