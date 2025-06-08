
import React, { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { TermoAuxiliar } from '@/types/monitoramento';

const TRIBUNAIS_OPCOES = [
  'TJSP', 'TJRJ', 'TJMG', 'TJRS', 'TJPR', 'TJSC', 'TJGO', 'TJMS', 'TJMT',
  'TJBA', 'TJPE', 'TJCE', 'TJPB', 'TJES', 'TJRN', 'TJAL', 'TJSE', 'TJPI',
  'TJMA', 'TJPA', 'TJAP', 'TJAC', 'TJRO', 'TJRR', 'TJAM', 'TJTO', 'TJDF'
];

interface MonitoramentoFormProps {
  loading: boolean;
  onSubmit: (data: {
    termo: string;
    variacoes: string[];
    termosAuxiliares: TermoAuxiliar[];
    tribunaisSelecionados: string[];
  }) => void;
}

const MonitoramentoForm: React.FC<MonitoramentoFormProps> = ({ loading, onSubmit }) => {
  const [termo, setTermo] = useState('');
  const [variacoes, setVariacoes] = useState<string[]>(['']);
  const [termosAuxiliares, setTermosAuxiliares] = useState<TermoAuxiliar[]>([]);
  const [tribunaisSelecionados, setTribunaisSelecionados] = useState<string[]>([]);

  const adicionarVariacao = () => {
    setVariacoes([...variacoes, '']);
  };

  const removerVariacao = (index: number) => {
    setVariacoes(variacoes.filter((_, i) => i !== index));
  };

  const adicionarTermoAuxiliar = () => {
    setTermosAuxiliares([...termosAuxiliares, { condicao: 'CONTEM', termo: '' }]);
  };

  const removerTermoAuxiliar = (index: number) => {
    setTermosAuxiliares(termosAuxiliares.filter((_, i) => i !== index));
  };

  const toggleTribunal = (tribunal: string) => {
    if (tribunaisSelecionados.includes(tribunal)) {
      setTribunaisSelecionados(tribunaisSelecionados.filter(t => t !== tribunal));
    } else {
      setTribunaisSelecionados([...tribunaisSelecionados, tribunal]);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      termo,
      variacoes,
      termosAuxiliares,
      tribunaisSelecionados
    });
  };

  return (
    <div className="space-y-6">
      {/* Termo Principal */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Termo Principal *
        </label>
        <input
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Ex: João da Silva"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Variações */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Variações do Termo
        </label>
        {variacoes.map((variacao, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={variacao}
              onChange={(e) => {
                const newVariacoes = [...variacoes];
                newVariacoes[index] = e.target.value;
                setVariacoes(newVariacoes);
              }}
              placeholder="Ex: João, Joãozinho"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {variacoes.length > 1 && (
              <button
                onClick={() => removerVariacao(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={adicionarVariacao}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          + Adicionar variação
        </button>
      </div>

      {/* Termos Auxiliares */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Termos Auxiliares
        </label>
        {termosAuxiliares.map((termo, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <select
              value={termo.condicao}
              onChange={(e) => {
                const newTermos = [...termosAuxiliares];
                newTermos[index].condicao = e.target.value as any;
                setTermosAuxiliares(newTermos);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="CONTEM">Contém</option>
              <option value="NAO_CONTEM">Não contém</option>
              <option value="CONTEM_ALGUMA">Contém alguma</option>
            </select>
            <input
              type="text"
              value={termo.termo}
              onChange={(e) => {
                const newTermos = [...termosAuxiliares];
                newTermos[index].termo = e.target.value;
                setTermosAuxiliares(newTermos);
              }}
              placeholder="Termo"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => removerTermoAuxiliar(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          onClick={adicionarTermoAuxiliar}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          + Adicionar termo auxiliar
        </button>
      </div>

      {/* Tribunais */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Tribunais
        </label>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {TRIBUNAIS_OPCOES.map((tribunal) => (
            <button
              key={tribunal}
              onClick={() => toggleTribunal(tribunal)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                tribunaisSelecionados.includes(tribunal)
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              } border hover:bg-blue-50`}
            >
              {tribunal}
            </button>
          ))}
        </div>
      </div>

      {/* Botão de criar */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Criando...</span>
          </>
        ) : (
          <>
            <CheckCircle className="h-5 w-5" />
            <span>Criar Monitoramento</span>
          </>
        )}
      </button>
    </div>
  );
};

export default MonitoramentoForm;
