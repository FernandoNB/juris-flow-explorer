
import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { Monitoramento } from '@/types/monitoramento';
import { formatTermosAuxiliares } from '@/utils/monitoramentoUtils';

interface MonitoramentoDetailsProps {
  monitoramento: Monitoramento;
  loading: boolean;
  loadingResults: boolean;
  onViewResults: (id: number) => void;
  onDelete: (id: number) => void;
}

const MonitoramentoDetails: React.FC<MonitoramentoDetailsProps> = ({
  monitoramento,
  loading,
  loadingResults,
  onViewResults,
  onDelete
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">
        {monitoramento.termo}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Variações</h3>
          <ul className="list-disc list-inside text-slate-600">
            {monitoramento.variacoes?.length > 0 ? 
              monitoramento.variacoes.map((variacao, index) => (
                <li key={index}>{variacao}</li>
              )) : <li>Nenhuma variação</li>
            }
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Tribunais</h3>
          <div className="flex flex-wrap gap-2">
            {monitoramento.tribunais_especificos?.length > 0 ? 
              monitoramento.tribunais_especificos.map((tribunal, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tribunal}
                </span>
              )) : <span className="text-slate-600">Todos os tribunais</span>
            }
          </div>
        </div>
      </div>

      {monitoramento.termos_auxiliares && Object.keys(monitoramento.termos_auxiliares).length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Termos Auxiliares</h3>
          <div className="space-y-2">
            {formatTermosAuxiliares(monitoramento.termos_auxiliares).map((termo, index) => (
              <div key={index} className="flex items-center space-x-2 text-slate-600">
                <span className="px-2 py-1 bg-slate-100 rounded text-xs">
                  {termo.condicao.replace('_', ' ')}
                </span>
                <span>{termo.termo}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-4 pt-4 border-t">
        <button
          onClick={() => onViewResults(monitoramento.id)}
          disabled={loadingResults}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <FileText className="h-5 w-5" />
          <span>Ver Resultados</span>
        </button>
        
        <button
          onClick={() => onDelete(monitoramento.id)}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <Trash2 className="h-5 w-5" />
          <span>Excluir</span>
        </button>
      </div>
    </div>
  );
};

export default MonitoramentoDetails;
