
import React, { useState } from 'react';
import { Search, FileText, Calendar, Clock, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/api';

interface Movimentacao {
  id: number;
  data: string;
  tipo: string;
  conteudo: string;
  fonte: {
    fonte_id: number;
    nome: string;
    tipo: string;
    sigla: string;
    grau: number;
    grau_formatado: string;
  };
}

const Movimentacoes = () => {
  const [numeroCNJ, setNumeroCNJ] = useState('');
  const [loading, setLoading] = useState(false);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
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
      const response = await fetch(`https://api.escavador.com/api/v2/processos/numero_cnj/${numeroCNJ}/movimentacoes`, {
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

      setMovimentacoes(data.items || []);
      setLoading(false);
      
      toast({
        title: "Movimentações carregadas",
        description: `Encontradas ${data.items?.length || 0} movimentações para ${numeroCNJ}.`
      });
      
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Erro na consulta",
        description: error.message || "Não foi possível carregar as movimentações do processo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'andamento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'decisao':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'intimacao':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'peticao':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Movimentações</h1>
                <p className="text-slate-600">Acompanhe todas as movimentações de um processo</p>
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Carregando...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Buscar Movimentações</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Lista de Movimentações */}
        {movimentacoes.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-6 w-6 text-cyan-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                Movimentações do Processo ({movimentacoes.length})
              </h2>
            </div>

            <div className="space-y-6">
              {movimentacoes.map((mov, index) => (
                <div
                  key={mov.id}
                  className="relative border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Linha da timeline (exceto para o último item) */}
                  {index < movimentacoes.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-full bg-slate-200"></div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    {/* Ícone da timeline */}
                    <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center relative z-10">
                      <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-2 lg:space-y-0 mb-3">
                        <div>
                          <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(mov.data)}</span>
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {mov.conteudo}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTipoColor(mov.tipo)}`}>
                            {mov.tipo}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {mov.fonte.sigla} - {mov.fonte.grau_formatado}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-600">
                        <p><strong>Fonte:</strong> {mov.fonte.nome}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Estatísticas */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{movimentacoes.length}</div>
                <div className="text-sm text-slate-600">Total de Movimentações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {formatDate(movimentacoes[0]?.data || "")}
                </div>
                <div className="text-sm text-slate-600">Última Movimentação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {new Set(movimentacoes.map(m => m.tipo)).size}
                </div>
                <div className="text-sm text-slate-600">Tipos Diferentes</div>
              </div>
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {!loading && movimentacoes.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Consulte as movimentações
            </h3>
            <p className="text-slate-600">
              Digite o número CNJ para visualizar todas as movimentações do processo
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movimentacoes;
