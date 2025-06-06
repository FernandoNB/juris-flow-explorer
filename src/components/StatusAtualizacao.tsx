
import React, { useState } from 'react';
import { Eye, Search, Clock, CheckCircle, XCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/api';

interface StatusAtualizacao {
  numero_cnj: string;
  data_ultima_verificacao: string | null;
  tempo_desde_ultima_verificacao: string | null;
  ultima_verificacao: {
    id: number;
    status: 'PENDENTE' | 'SUCESSO' | 'NAO_ENCONTRADO' | 'ERRO';
    criado_em: string;
    concluido_em: string | null;
  } | null;
}

const StatusAtualizacao = () => {
  const [numeroCNJ, setNumeroCNJ] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusAtualizacao | null>(null);
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
      const response = await fetch(`https://api.escavador.com/api/v2/processos/numero_cnj/${numeroCNJ}/status-atualizacao`, {
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

      setStatus(data);
      setLoading(false);
      
      toast({
        title: "Status carregado",
        description: `Status de atualização obtido para ${numeroCNJ}.`
      });
      
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Erro na consulta",
        description: error.message || "Não foi possível verificar o status de atualização. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (statusType: string) => {
    switch (statusType) {
      case 'PENDENTE':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'SUCESSO':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'NAO_ENCONTRADO':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'ERRO':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SUCESSO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'NAO_ENCONTRADO':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ERRO':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (statusType: string) => {
    switch (statusType) {
      case 'PENDENTE':
        return 'Aguardando atualização';
      case 'SUCESSO':
        return 'Atualizado com sucesso';
      case 'NAO_ENCONTRADO':
        return 'Processo não encontrado';
      case 'ERRO':
        return 'Erro na atualização';
      default:
        return 'Status desconhecido';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Status de Atualização</h1>
                <p className="text-slate-600">Verifique o status de atualização de processos</p>
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Verificar Status</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resultado do Status */}
        {status && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                Status para {status.numero_cnj}
              </h2>
            </div>

            <div className="grid gap-6">
              {/* Informações Gerais */}
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Informações Gerais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Última Verificação</label>
                    <p className="text-slate-900">
                      {status.data_ultima_verificacao 
                        ? formatDateTime(status.data_ultima_verificacao)
                        : "Nunca verificado"
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Tempo Desde Última Verificação</label>
                    <p className="text-slate-900">
                      {status.tempo_desde_ultima_verificacao || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status da Última Verificação */}
              {status.ultima_verificacao ? (
                <div className="border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Última Solicitação de Atualização</h3>
                  
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border mb-4 ${getStatusColor(status.ultima_verificacao.status)}`}>
                    {getStatusIcon(status.ultima_verificacao.status)}
                    <span className="font-medium">{getStatusText(status.ultima_verificacao.status)}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">ID da Solicitação</label>
                      <p className="text-slate-900">#{status.ultima_verificacao.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Criado em</label>
                      <p className="text-slate-900">{formatDateTime(status.ultima_verificacao.criado_em)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Concluído em</label>
                      <p className="text-slate-900">
                        {status.ultima_verificacao.concluido_em 
                          ? formatDateTime(status.ultima_verificacao.concluido_em)
                          : "Em andamento"
                        }
                      </p>
                    </div>
                  </div>

                  {/* Explicação do Status */}
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Sobre este status:</h4>
                    <p className="text-sm text-slate-600">
                      {status.ultima_verificacao.status === 'PENDENTE' && "O robô está aguardando para buscar as informações no Tribunal."}
                      {status.ultima_verificacao.status === 'SUCESSO' && "O processo foi atualizado no Tribunal corretamente."}
                      {status.ultima_verificacao.status === 'NAO_ENCONTRADO' && "O robô não encontrou o processo no sistema do Tribunal (pode ser processo físico, segredo de justiça, arquivado, etc)."}
                      {status.ultima_verificacao.status === 'ERRO' && "Houve alguma falha ao tentar atualizar o processo."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Nenhuma solicitação de atualização
                  </h3>
                  <p className="text-slate-600">
                    Este processo ainda não teve nenhuma solicitação de atualização.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {!loading && !status && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Eye className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Verifique o status
            </h3>
            <p className="text-slate-600">
              Digite o número CNJ para verificar o status de atualização do processo
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusAtualizacao;
