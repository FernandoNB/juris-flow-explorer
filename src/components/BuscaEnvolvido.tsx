
import React, { useState } from 'react';
import { Search, User, FileText, Calendar, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProcessoEnvolvido {
  numero_cnj: string;
  tribunal: string;
  instancia: string;
  classe: string;
  assunto: string;
  data_distribuicao: string;
  comarca: string;
  vara: string;
  valor_causa?: number;
}

const BuscaEnvolvido = () => {
  const [formData, setFormData] = useState({
    nome: '',
    documento: ''
  });
  const [loading, setLoading] = useState(false);
  const [processos, setProcessos] = useState<ProcessoEnvolvido[]>([]);
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
      // Aqui seria a chamada real para o backend
      // const response = await fetch('/api/envolvido/processos', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulando resposta da API para demonstração
      setTimeout(() => {
        const mockProcessos: ProcessoEnvolvido[] = [
          {
            numero_cnj: "1234567-89.2023.8.26.0001",
            tribunal: "TJSP",
            instancia: "1ª Instância",
            classe: "Procedimento Comum",
            assunto: "Danos Morais",
            data_distribuicao: "2023-05-15",
            comarca: "São Paulo",
            vara: "1ª Vara Cível",
            valor_causa: 50000
          },
          {
            numero_cnj: "9876543-21.2023.8.26.0002",
            tribunal: "TJSP",
            instancia: "1ª Instância",
            classe: "Ação de Cobrança",
            assunto: "Inadimplemento Contratual",
            data_distribuicao: "2023-08-20",
            comarca: "São Paulo",
            vara: "2ª Vara Cível"
          }
        ];
        
        setProcessos(mockProcessos);
        setLoading(false);
        
        toast({
          title: "Consulta realizada",
          description: `Encontrados ${mockProcessos.length} processos para ${formData.nome}.`
        });
      }, 2000);
      
    } catch (error) {
      setLoading(false);
      toast({
        title: "Erro na consulta",
        description: "Não foi possível realizar a consulta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
                  value={formData.documento}
                  onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
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
                          {processo.tribunal}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {processo.classe}
                      </h3>
                      
                      <p className="text-slate-600 mb-4">{processo.assunto}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">
                            Distribuído em {formatDate(processo.data_distribuicao)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">
                            {processo.comarca} - {processo.vara}
                          </span>
                        </div>
                        
                        {processo.valor_causa && (
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-600">
                              Valor: {formatCurrency(processo.valor_causa)}
                            </span>
                          </div>
                        )}
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
