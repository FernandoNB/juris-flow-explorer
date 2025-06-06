
import React, { useState } from 'react';
import { FileText, Search, Calendar, MapPin, Users, DollarSign, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/api';

interface ProcessoDetalhes {
  numero_cnj: string;
  titulo_polo_ativo: string;
  titulo_polo_passivo: string;
  ano_inicio: number;
  data_inicio: string;
  data_ultima_movimentacao: string;
  quantidade_movimentacoes: number;
  fontes_tribunais_estao_arquivadas: boolean;
  data_ultima_verificacao: string;
  tempo_desde_ultima_verificacao: string;
  estado_origem: {
    nome: string;
    sigla: string;
  };
  unidade_origem: {
    nome: string;
    cidade: string;
    estado: {
      nome: string;
      sigla: string;
    };
    tribunal_sigla: string;
  };
  fontes: Array<{
    id: number;
    descricao: string;
    nome: string;
    sigla: string;
    tipo: string;
    grau: number;
    grau_formatado: string;
    data_inicio: string;
    data_ultima_movimentacao: string;
    segredo_justica: boolean | null;
    arquivado: boolean | null;
    status_predito: string;
    fisico: boolean;
    sistema: string;
    capa: {
      classe: string;
      assunto: string;
      area: string;
      orgao_julgador: string;
      situacao: string;
      valor_causa?: {
        valor: string;
        moeda: string;
        valor_formatado: string;
      };
      data_distribuicao: string;
      data_arquivamento: string | null;
    };
    envolvidos: Array<{
      nome: string;
      tipo_pessoa: string;
      tipo: string;
      tipo_normalizado: string;
      polo: string;
      cpf?: string;
      cnpj?: string;
      advogados?: Array<{
        nome: string;
        tipo: string;
        tipo_normalizado: string;
        polo: string;
        cpf: string;
        oabs: Array<{
          uf: string;
          tipo: string;
          numero: number;
        }>;
      }>;
    }>;
  }>;
}

const DetalhesProcesso = () => {
  const [numeroCNJ, setNumeroCNJ] = useState('');
  const [loading, setLoading] = useState(false);
  const [processo, setProcesso] = useState<ProcessoDetalhes | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!numeroCNJ.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o número CNJ do processo.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`https://api.escavador.com/api/v2/processos/numero_cnj/${numeroCNJ}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${API_CONFIG.ESCAVADOR_TOKEN}`,
          "X-Requested-With": "XMLHttpRequest",
          "Accept": "application/json",
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na consulta');
      }

      setProcesso(data);
      setLoading(false);
      
      toast({
        title: "Processo encontrado",
        description: `Detalhes carregados para ${numeroCNJ}.`
      });
      
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Erro na consulta",
        description: error.message || "Não foi possível carregar os detalhes do processo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Detalhes do Processo</h1>
                <p className="text-slate-600">Visualize informações completas usando número CNJ</p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Link>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Número CNJ *
              </label>
              <input
                type="text"
                value={numeroCNJ}
                onChange={(e) => setNumeroCNJ(e.target.value)}
                placeholder="0000000-00.0000.0.00.0000"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Carregando...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Consultar Processo</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Detalhes do Processo */}
        {processo && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                {processo.numero_cnj}
              </h2>
            </div>

            <div className="grid gap-8">
              {/* Informações Básicas */}
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Polo Ativo</label>
                    <p className="text-slate-900">{processo.titulo_polo_ativo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Polo Passivo</label>
                    <p className="text-slate-900">{processo.titulo_polo_passivo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Ano de Início</label>
                    <p className="text-slate-900">{processo.ano_inicio}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Estado de Origem</label>
                    <p className="text-slate-900">{processo.estado_origem.nome} ({processo.estado_origem.sigla})</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Tribunal</label>
                    <p className="text-slate-900">{processo.unidade_origem.tribunal_sigla}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Unidade de Origem</label>
                    <p className="text-slate-900">{processo.unidade_origem.nome}</p>
                  </div>
                </div>
              </div>

              {/* Datas e Estatísticas */}
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Datas e Estatísticas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <label className="text-sm font-medium text-slate-600">Data de Início</label>
                      <p className="text-slate-900">{formatDate(processo.data_inicio)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <label className="text-sm font-medium text-slate-600">Última Movimentação</label>
                      <p className="text-slate-900">{formatDate(processo.data_ultima_movimentacao)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Quantidade de Movimentações</label>
                    <p className="text-slate-900">{processo.quantidade_movimentacoes}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Última Verificação</label>
                    <p className="text-slate-900">{formatDateTime(processo.data_ultima_verificacao)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Tempo desde última verificação</label>
                    <p className="text-slate-900">{processo.tempo_desde_ultima_verificacao}</p>
                  </div>
                </div>
              </div>

              {/* Fontes */}
              {processo.fontes && processo.fontes.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Fontes ({processo.fontes.length})</h3>
                  <div className="space-y-6">
                    {processo.fontes.map((fonte) => (
                      <div key={fonte.id} className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-900">{fonte.nome}</h4>
                            <p className="text-sm text-slate-600">{fonte.descricao} - {fonte.grau_formatado}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              fonte.status_predito === 'ATIVO' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {fonte.status_predito}
                            </span>
                            {fonte.segredo_justica && (
                              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                Segredo de Justiça
                              </span>
                            )}
                          </div>
                        </div>

                        {fonte.capa && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div>
                              <label className="font-medium text-slate-600">Classe</label>
                              <p className="text-slate-900">{fonte.capa.classe}</p>
                            </div>
                            <div>
                              <label className="font-medium text-slate-600">Assunto</label>
                              <p className="text-slate-900">{fonte.capa.assunto}</p>
                            </div>
                            <div>
                              <label className="font-medium text-slate-600">Área</label>
                              <p className="text-slate-900">{fonte.capa.area}</p>
                            </div>
                            <div>
                              <label className="font-medium text-slate-600">Órgão Julgador</label>
                              <p className="text-slate-900">{fonte.capa.orgao_julgador}</p>
                            </div>
                            <div>
                              <label className="font-medium text-slate-600">Situação</label>
                              <p className="text-slate-900">{fonte.capa.situacao}</p>
                            </div>
                            {fonte.capa.valor_causa && (
                              <div>
                                <label className="font-medium text-slate-600">Valor da Causa</label>
                                <p className="text-slate-900">{fonte.capa.valor_causa.valor_formatado}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Envolvidos por fonte */}
                        {fonte.envolvidos && fonte.envolvidos.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-medium text-slate-700 mb-2">Envolvidos ({fonte.envolvidos.length})</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {fonte.envolvidos.map((envolvido, idx) => (
                                <div key={idx} className="bg-white p-3 rounded border">
                                  <p className="font-medium text-slate-900">{envolvido.nome}</p>
                                  <p className="text-sm text-slate-600">{envolvido.tipo_normalizado} - Polo {envolvido.polo}</p>
                                  <p className="text-xs text-slate-500">{envolvido.tipo_pessoa}</p>
                                  
                                  {envolvido.advogados && envolvido.advogados.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs font-medium text-slate-600">Advogados:</p>
                                      {envolvido.advogados.map((advogado, advIdx) => (
                                        <div key={advIdx} className="text-xs text-slate-600">
                                          {advogado.nome} 
                                          {advogado.oabs && advogado.oabs.length > 0 && (
                                            <span> - OAB: {advogado.oabs[0].numero}/{advogado.oabs[0].uf}</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {!loading && !processo && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Consulte um processo
            </h3>
            <p className="text-slate-600">
              Digite o número CNJ para visualizar os detalhes completos do processo
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalhesProcesso;
