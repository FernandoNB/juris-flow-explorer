
import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Trash2, ArrowLeft, Users, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/api';

interface TermoAuxiliar {
  condicao: 'CONTEM' | 'NAO_CONTEM' | 'CONTEM_ALGUMA';
  termo: string;
}

interface NovoMonitoramento {
  termo: string;
  variacoes: string[];
  termos_auxiliares: TermoAuxiliar[];
  tribunais: string[];
}

interface Monitoramento {
  id: number;
  termo: string;
  tipo?: string;
  criado_em: string;
  variacoes: string[];
  termos_auxiliares: {
    CONTEM?: string[];
    NAO_CONTEM?: string[];
    CONTEM_ALGUMA?: string[];
  };
  tribunais_especificos: string[];
}

interface ProcessoEncontrado {
  numero_cnj: string;
  data_inicio: string;
  tribunal: string;
  match: string;
  estado_origem: {
    nome: string;
    sigla: string;
  };
}

const TRIBUNAIS_OPCOES = [
  'TJSP', 'TJRJ', 'TJMG', 'TJRS', 'TJPR', 'TJSC', 'TJGO', 'TJMS', 'TJMT',
  'TJBA', 'TJPE', 'TJCE', 'TJPB', 'TJES', 'TJRN', 'TJAL', 'TJSE', 'TJPI',
  'TJMA', 'TJPA', 'TJAP', 'TJAC', 'TJRO', 'TJRR', 'TJAM', 'TJTO', 'TJDF'
];

const MonitoramentoProcessos = () => {
  const [view, setView] = useState<'list' | 'create' | 'details' | 'results'>('list');
  const [monitoramentos, setMonitoramentos] = useState<Monitoramento[]>([]);
  const [selectedMonitoramento, setSelectedMonitoramento] = useState<Monitoramento | null>(null);
  const [processosEncontrados, setProcessosEncontrados] = useState<ProcessoEncontrado[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const { toast } = useToast();

  // Estados do formulário
  const [termo, setTermo] = useState('');
  const [variacoes, setVariacoes] = useState<string[]>(['']);
  const [termosAuxiliares, setTermosAuxiliares] = useState<TermoAuxiliar[]>([]);
  const [tribunaisSelecionados, setTribunaisSelecionados] = useState<string[]>([]);

  useEffect(() => {
    if (view === 'list') {
      carregarMonitoramentos();
    }
  }, [view]);

  const carregarMonitoramentos = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.escavador.com/api/v2/monitoramentos/novos-processos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.ESCAVADOR_TOKEN}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar monitoramentos');
      }

      setMonitoramentos(data.items || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os monitoramentos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const criarMonitoramento = async () => {
    if (!termo.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o termo principal.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const body: NovoMonitoramento = {
        termo: termo.trim(),
        variacoes: variacoes.filter(v => v.trim()),
        termos_auxiliares: termosAuxiliares,
        tribunais: tribunaisSelecionados
      };

      const response = await fetch('https://api.escavador.com/api/v2/monitoramentos/novos-processos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.ESCAVADOR_TOKEN}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar monitoramento');
      }

      toast({
        title: "Monitoramento criado",
        description: "O monitoramento foi criado com sucesso!"
      });

      // Limpar formulário
      setTermo('');
      setVariacoes(['']);
      setTermosAuxiliares([]);
      setTribunaisSelecionados([]);
      
      // Voltar para lista
      setView('list');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o monitoramento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const excluirMonitoramento = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.escavador.com/api/v2/monitoramentos/novos-processos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.ESCAVADOR_TOKEN}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao excluir monitoramento');
      }

      toast({
        title: "Monitoramento excluído",
        description: "O monitoramento foi excluído com sucesso!"
      });

      carregarMonitoramentos();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir o monitoramento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const carregarResultados = async (id: number) => {
    setLoadingResults(true);
    try {
      const response = await fetch(`https://api.escavador.com/api/v2/monitoramentos/novos-processos/${id}/resultados`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.ESCAVADOR_TOKEN}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar resultados');
      }

      setProcessosEncontrados(data.items || []);
      setView('results');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os resultados.",
        variant: "destructive"
      });
    } finally {
      setLoadingResults(false);
    }
  };

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

  // Fluxo unificado de consulta de processos
  const consultarProcesso = (numeroCNJ: string, acao: 'detalhes' | 'movimentacoes') => {
    const url = acao === 'detalhes' 
      ? `/detalhes-processo?numero=${numeroCNJ}`
      : `/movimentacoes?numero=${numeroCNJ}`;
    window.location.href = url;
  };

  // Helper function to format termos auxiliares from API response
  const formatTermosAuxiliares = (termosAuxiliares: any) => {
    if (!termosAuxiliares || typeof termosAuxiliares !== 'object') return [];
    
    const result = [];
    if (termosAuxiliares.CONTEM) {
      result.push(...termosAuxiliares.CONTEM.map((termo: string) => ({ condicao: 'CONTEM', termo })));
    }
    if (termosAuxiliares.NAO_CONTEM) {
      result.push(...termosAuxiliares.NAO_CONTEM.map((termo: string) => ({ condicao: 'NAO_CONTEM', termo })));
    }
    if (termosAuxiliares.CONTEM_ALGUMA) {
      result.push(...termosAuxiliares.CONTEM_ALGUMA.map((termo: string) => ({ condicao: 'CONTEM_ALGUMA', termo })));
    }
    return result;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const cleanHtmlTags = (htmlString: string) => {
    return htmlString.replace(/<[^>]*>/g, '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {view === 'list' && 'Monitoramento de Processos'}
                  {view === 'create' && 'Novo Monitoramento'}
                  {view === 'details' && 'Detalhes do Monitoramento'}
                  {view === 'results' && 'Processos Encontrados'}
                </h1>
                <p className="text-slate-600">
                  {view === 'list' && 'Gerencie monitoramentos de novos processos'}
                  {view === 'create' && 'Configure um novo monitoramento'}
                  {view === 'details' && 'Visualize detalhes do monitoramento'}
                  {view === 'results' && 'Resultados do monitoramento'}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              {view !== 'list' && (
                <button
                  onClick={() => setView('list')}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar</span>
                </button>
              )}
              <Link
                to="/"
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Início</span>
              </Link>
            </div>
          </div>

          {/* Botão de criar novo monitoramento */}
          {view === 'list' && (
            <button
              onClick={() => setView('create')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Monitoramento</span>
            </button>
          )}
        </div>

        {/* Lista de Monitoramentos */}
        {view === 'list' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Carregando monitoramentos...</p>
              </div>
            ) : monitoramentos.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Nenhum monitoramento encontrado
                </h3>
                <p className="text-slate-600 mb-6">
                  Crie seu primeiro monitoramento para acompanhar novos processos
                </p>
                <button
                  onClick={() => setView('create')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                >
                  Criar Monitoramento
                </button>
              </div>
            ) : (
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
                          onClick={() => {
                            setSelectedMonitoramento(mon);
                            setView('details');
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => carregarResultados(mon.id)}
                          disabled={loadingResults}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Ver resultados"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => excluirMonitoramento(mon.id)}
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
            )}
          </div>
        )}

        {/* Formulário de Criação */}
        {view === 'create' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
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
                onClick={criarMonitoramento}
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
          </div>
        )}

        {/* Detalhes do Monitoramento */}
        {view === 'details' && selectedMonitoramento && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedMonitoramento.termo}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Variações</h3>
                  <ul className="list-disc list-inside text-slate-600">
                    {selectedMonitoramento.variacoes?.length > 0 ? 
                      selectedMonitoramento.variacoes.map((variacao, index) => (
                        <li key={index}>{variacao}</li>
                      )) : <li>Nenhuma variação</li>
                    }
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Tribunais</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMonitoramento.tribunais_especificos?.length > 0 ? 
                      selectedMonitoramento.tribunais_especificos.map((tribunal, index) => (
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

              {selectedMonitoramento.termos_auxiliares && Object.keys(selectedMonitoramento.termos_auxiliares).length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Termos Auxiliares</h3>
                  <div className="space-y-2">
                    {formatTermosAuxiliares(selectedMonitoramento.termos_auxiliares).map((termo, index) => (
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
                  onClick={() => carregarResultados(selectedMonitoramento.id)}
                  disabled={loadingResults}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <FileText className="h-5 w-5" />
                  <span>Ver Resultados</span>
                </button>
                
                <button
                  onClick={() => excluirMonitoramento(selectedMonitoramento.id)}
                  disabled={loading}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resultados do Monitoramento */}
        {view === 'results' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {loadingResults ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Carregando resultados...</p>
              </div>
            ) : processosEncontrados.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Nenhum processo encontrado
                </h3>
                <p className="text-slate-600">
                  Este monitoramento ainda não encontrou novos processos
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Processos Encontrados ({processosEncontrados.length})
                </h2>
                
                <div className="space-y-4">
                  {processosEncontrados.map((processo, index) => (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoramentoProcessos;
