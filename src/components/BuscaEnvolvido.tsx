import React, { useState } from 'react';
import { Search, User, FileText, Calendar, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/api';

interface ProcessoEnvolvido {
  numero_cnj: string;
  titulo_polo_ativo: string;
  titulo_polo_passivo: string;
  ano_inicio: number;
  data_inicio: string;
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
  data_ultima_movimentacao: string;
  quantidade_movimentacoes: number;
  fontes_tribunais_estao_arquivadas: boolean;
}

const BuscaEnvolvido = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf_cnpj: ''
  });
  const [loading, setLoading] = useState(false);
  const [processos, setProcessos] = useState<ProcessoEnvolvido[]>([]);
  const [envolvidoEncontrado, setEnvolvidoEncontrado] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome do envolvido.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const url = new URL("https://api.escavador.com/api/v2/envolvido/processos");
      url.searchParams.append("nome", formData.nome);
      if (formData.cpf_cnpj.trim()) {
        url.searchParams.append("cpf_cnpj", formData.cpf_cnpj);
      }

      const response = await fetch(url, {
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

      setProcessos(data.items || []);
      setEnvolvidoEncontrado(data.envolvido_encontrado || null);
      setLoading(false);
      
      toast({
        title: "Consulta realizada",
        description: `Encontrados ${data.items?.length || 0} processos para ${formData.nome}.`
      });
      
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Erro na consulta",
        description: error.message || "Não foi possível realizar a consulta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Busca por Envolvido</h1>
              <p className="text-slate-600">Encontre processos por nome ou documento do envolvido</p>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nome do Envolvido *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Digite o nome completo"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  CPF/CNPJ (opcional)
                </label>
                <input
                  type="text"
                  value={formData.cpf_cnpj}
                  onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                  placeholder="000.000.000-00 ou 00.000.000/0001-00"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Consultando...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Buscar Processos</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Informações do Envolvido */}
        {envolvidoEncontrado && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Envolvido Encontrado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Nome</label>
                <p className="text-slate-900">{envolvidoEncontrado.nome}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Tipo de Pessoa</label>
                <p className="text-slate-900">{envolvidoEncontrado.tipo_pessoa}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Quantidade de Processos</label>
                <p className="text-slate-900">{envolvidoEncontrado.quantidade_processos}</p>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {processos.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                Processos Encontrados ({processos.length})
              </h2>
            </div>

            <div className="grid gap-6">
              {processos.map((processo, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-lg font-bold text-blue-600">
                          {processo.numero_cnj}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {processo.unidade_origem.tribunal_sigla}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-slate-700 mb-1">Polo Ativo</h4>
                        <p className="text-slate-600 text-sm mb-2">{processo.titulo_polo_ativo}</p>
                        
                        <h4 className="font-semibold text-slate-700 mb-1">Polo Passivo</h4>
                        <p className="text-slate-600 text-sm">{processo.titulo_polo_passivo}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">
                            Início: {formatDate(processo.data_inicio)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">
                            Última mov.: {formatDate(processo.data_ultima_movimentacao)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">
                            {processo.unidade_origem.cidade} - {processo.estado_origem.sigla}
                          </span>
                        </div>

                        <div className="text-slate-600">
                          {processo.quantidade_movimentacoes} movimentações
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                        Ver Detalhes
                      </button>
                      <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                        Movimentações
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {!loading && processos.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Pronto para começar
            </h3>
            <p className="text-slate-600">
              Preencha o formulário acima para buscar processos por envolvido
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscaEnvolvido;
