import React, { useState } from 'react';
import { RefreshCw, Send, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/api';

interface SolicitacaoResposta {
  id: number;
  status: 'PENDENTE';
  numero_cnj: string;
  criado_em: string;
  concluido_em: string | null;
}

const SolicitarAtualizacao = () => {
  const [formData, setFormData] = useState({
    numero_cnj: '',
    enviar_callback: false,
    documentos_publicos: false
  });
  const [loading, setLoading] = useState(false);
  const [solicitacao, setSolicitacao] = useState<SolicitacaoResposta | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numero_cnj.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o número CNJ do processo.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const body = {
        enviar_callback: formData.enviar_callback ? 1 : 0,
        documentos_publicos: formData.documentos_publicos ? 1 : 0
      };

      const response = await fetch(`https://api.escavador.com/api/v2/processos/numero_cnj/${formData.numero_cnj}/solicitar-atualizacao`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_CONFIG.ESCAVADOR_TOKEN}`,
          "X-Requested-With": "XMLHttpRequest",
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na solicitação');
      }

      setSolicitacao(data);
      setLoading(false);
      
      toast({
        title: "Solicitação enviada",
        description: `Atualização solicitada para ${formData.numero_cnj}. ID: #${data.id}`
      });
      
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Erro na solicitação",
        description: error.message || "Não foi possível solicitar a atualização do processo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleNovaConsulta = () => {
    setSolicitacao(null);
    setFormData({
      numero_cnj: '',
      enviar_callback: false,
      documentos_publicos: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Solicitar Atualização</h1>
              <p className="text-slate-600">Solicite a atualização de dados de um processo</p>
            </div>
          </div>

          {!solicitacao && (
            <>
              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Número CNJ *
                  </label>
                  <input
                    type="text"
                    value={formData.numero_cnj}
                    onChange={(e) => setFormData({ ...formData, numero_cnj: e.target.value })}
                    placeholder="0000000-00.0000.0.00.0000"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>

                {/* Opções Avançadas */}
                <div className="border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Opções Avançadas</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="enviar_callback"
                        checked={formData.enviar_callback}
                        onChange={(e) => setFormData({ ...formData, enviar_callback: e.target.checked })}
                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                      />
                      <label htmlFor="enviar_callback" className="text-slate-700">
                        Enviar callback quando a atualização for concluída
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="documentos_publicos"
                        checked={formData.documentos_publicos}
                        onChange={(e) => setFormData({ ...formData, documentos_publicos: e.target.checked })}
                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                      />
                      <label htmlFor="documentos_publicos" className="text-slate-700">
                        Incluir documentos públicos na atualização
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Solicitando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Solicitar Atualização</span>
                    </>
                  )}
                </button>
              </form>

              {/* Informações sobre a solicitação */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">ℹ️ Sobre as solicitações de atualização</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• A atualização pode levar alguns minutos para ser processada</li>
                  <li>• Você receberá um ID de rastreamento para acompanhar o progresso</li>
                  <li>• O callback será enviado apenas se a opção estiver marcada</li>
                  <li>• Processos em segredo de justiça podem não ser atualizados</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Resultado da Solicitação */}
        {solicitacao && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Solicitação Enviada com Sucesso!
              </h2>
              <p className="text-slate-600">
                Sua solicitação de atualização foi registrada e está sendo processada.
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Detalhes da Solicitação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">ID da Solicitação</label>
                  <p className="text-slate-900 font-mono">#{solicitacao.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Número CNJ</label>
                  <p className="text-slate-900">{solicitacao.numero_cnj}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Status</label>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    {solicitacao.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Criado em</label>
                  <p className="text-slate-900">{formatDateTime(solicitacao.criado_em)}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-6">
              <h4 className="font-medium text-yellow-900 mb-2">⏱️ Próximos passos</h4>
              <p className="text-sm text-yellow-800">
                Acompanhe o status da sua solicitação usando o ID #{solicitacao.id} na página de "Status de Atualização". 
                O processo de atualização pode levar alguns minutos dependendo da disponibilidade do tribunal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleNovaConsulta}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Nova Solicitação
              </button>
              <button
                onClick={() => window.location.href = '/status-atualizacao'}
                className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
              >
                Verificar Status
              </button>
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {!loading && !solicitacao && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <RefreshCw className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Solicite uma atualização
            </h3>
            <p className="text-slate-600">
              Digite o token e o número CNJ do processo que você deseja atualizar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolicitarAtualizacao;
