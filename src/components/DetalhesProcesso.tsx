
import React, { useState } from 'react';
import { FileText, Search, Calendar, MapPin, Users, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProcessoDetalhes {
  numero_cnj: string;
  tribunal: string;
  instancia: string;
  classe: string;
  assunto: string;
  data_distribuicao: string;
  data_ultimo_movimento: string;
  comarca: string;
  vara: string;
  situacao: string;
  valor_causa?: number;
  segredo_justica: boolean;
  polo_ativo: Array<{
    nome: string;
    documento?: string;
    tipo: string;
  }>;
  polo_passivo: Array<{
    nome: string;
    documento?: string;
    tipo: string;
  }>;
  advogados: Array<{
    nome: string;
    oab: string;
    polo: string;
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
      // Simulando resposta da API para demonstração
      setTimeout(() => {
        const mockProcesso: ProcessoDetalhes = {
          numero_cnj: numeroCNJ,
          tribunal: "TJSP",
          instancia: "1ª Instância",
          classe: "Procedimento Comum Cível",
          assunto: "Responsabilidade Civil - Danos Morais",
          data_distribuicao: "2023-05-15",
          data_ultimo_movimento: "2024-01-20",
          comarca: "São Paulo",
          vara: "1ª Vara Cível Central",
          situacao: "Em andamento",
          valor_causa: 75000,
          segredo_justica: false,
          polo_ativo: [
            { nome: "Maria Silva Santos", documento: "123.456.789-00", tipo: "Pessoa Física" },
          ],
          polo_passivo: [
            { nome: "Empresa XYZ Ltda", documento: "12.345.678/0001-90", tipo: "Pessoa Jurídica" },
          ],
          advogados: [
            { nome: "Dr. João Advogado", oab: "123456/SP", polo: "Ativo" },
            { nome: "Dra. Ana Defensora", oab: "654321/SP", polo: "Passivo" },
          ]
        };
        
        setProcesso(mockProcesso);
        setLoading(false);
        
        toast({
          title: "Processo encontrado",
          description: `Detalhes carregados para ${numeroCNJ}.`
        });
      }, 2000);
      
    } catch (error) {
      setLoading(false);
      toast({
        title: "Erro na consulta",
        description: "Não foi possível carregar os detalhes do processo.",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Detalhes do Processo</h1>
              <p className="text-slate-600">Visualize informações completas usando número CNJ</p>
            </div>
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
              {processo.segredo_justica && (
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Segredo de Justiça</span>
                </span>
              )}
            </div>

            <div className="grid gap-8">
              {/* Informações Básicas */}
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Classe</label>
                    <p className="text-slate-900">{processo.classe}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Assunto</label>
                    <p className="text-slate-900">{processo.assunto}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Situação</label>
                    <p className="text-slate-900">{processo.situacao}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Tribunal</label>
                    <p className="text-slate-900">{processo.tribunal}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Instância</label>
                    <p className="text-slate-900">{processo.instancia}</p>
                  </div>
                  {processo.valor_causa && (
                    <div>
                      <label className="text-sm font-medium text-slate-600">Valor da Causa</label>
                      <p className="text-slate-900">{formatCurrency(processo.valor_causa)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Datas e Local */}
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Datas e Localização</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <label className="text-sm font-medium text-slate-600">Data Distribuição</label>
                      <p className="text-slate-900">{formatDate(processo.data_distribuicao)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <label className="text-sm font-medium text-slate-600">Último Movimento</label>
                      <p className="text-slate-900">{formatDate(processo.data_ultimo_movimento)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <div>
                      <label className="text-sm font-medium text-slate-600">Vara</label>
                      <p className="text-slate-900">{processo.comarca} - {processo.vara}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Partes do Processo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span>Polo Ativo</span>
                  </h3>
                  <div className="space-y-3">
                    {processo.polo_ativo.map((parte, index) => (
                      <div key={index} className="bg-slate-50 p-3 rounded-lg">
                        <p className="font-medium text-slate-900">{parte.nome}</p>
                        <p className="text-sm text-slate-600">{parte.tipo}</p>
                        {parte.documento && (
                          <p className="text-sm text-slate-600">{parte.documento}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                    <Users className="h-5 w-5 text-red-600" />
                    <span>Polo Passivo</span>
                  </h3>
                  <div className="space-y-3">
                    {processo.polo_passivo.map((parte, index) => (
                      <div key={index} className="bg-slate-50 p-3 rounded-lg">
                        <p className="font-medium text-slate-900">{parte.nome}</p>
                        <p className="text-sm text-slate-600">{parte.tipo}</p>
                        {parte.documento && (
                          <p className="text-sm text-slate-600">{parte.documento}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advogados */}
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Advogados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processo.advogados.map((advogado, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-medium text-slate-900">{advogado.nome}</p>
                      <p className="text-sm text-slate-600">OAB: {advogado.oab}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                        advogado.polo === 'Ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Polo {advogado.polo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
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
