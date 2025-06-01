
import React, { useState } from 'react';
import { Scale, Search, FileText, Calendar, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProcessoOAB {
  numero_cnj: string;
  tribunal: string;
  classe: string;
  assunto: string;
  data_distribuicao: string;
  comarca: string;
  vara: string;
  polo_ativo: string[];
  polo_passivo: string[];
}

const ESTADOS_BRASIL = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

const BuscaOAB = () => {
  const [formData, setFormData] = useState({
    numero_oab: '',
    uf: ''
  });
  const [loading, setLoading] = useState(false);
  const [processos, setProcessos] = useState<ProcessoOAB[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numero_oab.trim() || !formData.uf) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, informe o número da OAB e o estado.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulando resposta da API para demonstração
      setTimeout(() => {
        const mockProcessos: ProcessoOAB[] = [
          {
            numero_cnj: "1234567-89.2023.8.26.0001",
            tribunal: "TJSP",
            classe: "Ação de Indenização",
            assunto: "Responsabilidade Civil",
            data_distribuicao: "2023-06-10",
            comarca: "São Paulo",
            vara: "3ª Vara Cível",
            polo_ativo: ["Maria Silva Santos"],
            polo_passivo: ["Empresa XYZ Ltda"]
          },
          {
            numero_cnj: "2468135-79.2023.8.26.0100",
            tribunal: "TJSP",
            classe: "Ação Trabalhista",
            assunto: "Rescisão Indireta",
            data_distribuicao: "2023-09-05",
            comarca: "São Paulo",
            vara: "15ª Vara do Trabalho",
            polo_ativo: ["João Pedro Oliveira"],
            polo_passivo: ["Transportadora ABC S.A."]
          }
        ];
        
        setProcessos(mockProcessos);
        setLoading(false);
        
        toast({
          title: "Consulta realizada",
          description: `Encontrados ${mockProcessos.length} processos para OAB ${formData.numero_oab}/${formData.uf}.`
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Busca por OAB</h1>
              <p className="text-slate-600">Consulte processos por número da OAB e estado</p>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Número da OAB *
                </label>
                <input
                  type="text"
                  value={formData.numero_oab}
                  onChange={(e) => setFormData({ ...formData, numero_oab: e.target.value })}
                  placeholder="Ex: 123456"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Estado (UF) *
                </label>
                <select
                  value={formData.uf}
                  onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                >
                  <option value="">Selecione o estado</option>
                  {ESTADOS_BRASIL.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.value} - {estado.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
              <FileText className="h-6 w-6 text-indigo-600" />
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
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-lg font-bold text-indigo-600">
                        {processo.numero_cnj}
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                        {processo.tribunal}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-slate-900">
                      {processo.classe}
                    </h3>
                    
                    <p className="text-slate-600">{processo.assunto}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Polo Ativo</h4>
                        <div className="space-y-1">
                          {processo.polo_ativo.map((parte, idx) => (
                            <span key={idx} className="block text-slate-600 text-sm">
                              {parte}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Polo Passivo</h4>
                        <div className="space-y-1">
                          {processo.polo_passivo.map((parte, idx) => (
                            <span key={idx} className="block text-slate-600 text-sm">
                              {parte}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm pt-4 border-t border-slate-100">
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
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium">
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
            <Scale className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Pronto para consultar
            </h3>
            <p className="text-slate-600">
              Preencha o número da OAB e o estado para buscar processos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscaOAB;
