
import React from 'react';
import { Search, Eye, FileText, Trash2 } from 'lucide-react';
import { Monitoramento } from '@/types/monitoramento';
import { formatDate } from '@/utils/monitoramentoUtils';

interface MonitoramentosListProps {
  monitoramentos: Monitoramento[];
  loading: boolean;
  loadingResults: boolean;
  onViewDetails: (monitoramento: Monitoramento) => void;
  onViewResults: (id: number) => void;
  onDelete: (id: number) => void;
  onCreateNew: () => void;
}

const MonitoramentosList: React.FC<MonitoramentosListProps> = ({
  monitoramentos,
  loading,
  loadingResults,
  onViewDetails,
  onViewResults,
  onDelete,
  onCreateNew
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Carregando monitoramentos...</p>
      </div>
    );
  }

  if (monitoramentos.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Nenhum monitoramento encontrado
        </h3>
        <p className="text-slate-600 mb-6">
          Crie seu primeiro monitoramento para acompanhar novos processos
        </p>
        <button
          onClick={onCreateNew}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
        >
          Criar Monitoramento
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Seus Monitoramentos ({monitoramentos.length})
      </h2>
      {monitoramentos.map((mon) => (
        <div
          key={mon.id}
          className="border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {mon.termo}
              </h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Variações:</strong> {mon.variacoes?.length > 0 ? mon.variacoes.join(', ') : 'Nenhuma'}</p>
                <p><strong>Tribunais:</strong> {mon.tribunais_especificos?.length > 0 ? mon.tribunais_especificos.join(', ') : 'Todos'}</p>
                <p><strong>Criado em:</strong> {formatDate(mon.criado_em)}</p>
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onViewDetails(mon)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Ver detalhes"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewResults(mon.id)}
                disabled={loadingResults}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                title="Ver resultados"
              >
                <FileText className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(mon.id)}
                disabled={loading}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonitoramentosList;
