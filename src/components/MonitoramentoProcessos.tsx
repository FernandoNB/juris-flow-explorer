
import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Monitoramento, ProcessoEncontrado, NovoMonitoramento } from '@/types/monitoramento';
import { carregarMonitoramentos, criarMonitoramento, excluirMonitoramento, carregarResultados } from '@/utils/monitoramentoApi';
import MonitoramentosList from './monitoramento/MonitoramentosList';
import MonitoramentoForm from './monitoramento/MonitoramentoForm';
import MonitoramentoDetails from './monitoramento/MonitoramentoDetails';
import ProcessosResults from './monitoramento/ProcessosResults';

const MonitoramentoProcessos = () => {
  const [view, setView] = useState<'list' | 'create' | 'details' | 'results'>('list');
  const [monitoramentos, setMonitoramentos] = useState<Monitoramento[]>([]);
  const [selectedMonitoramento, setSelectedMonitoramento] = useState<Monitoramento | null>(null);
  const [processosEncontrados, setProcessosEncontrados] = useState<ProcessoEncontrado[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (view === 'list') {
      handleCarregarMonitoramentos();
    }
  }, [view]);

  const handleCarregarMonitoramentos = async () => {
    setLoading(true);
    try {
      const data = await carregarMonitoramentos();
      setMonitoramentos(data);
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

  const handleCriarMonitoramento = async (formData: {
    termo: string;
    variacoes: string[];
    termosAuxiliares: any[];
    tribunaisSelecionados: string[];
  }) => {
    if (!formData.termo.trim()) {
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
        termo: formData.termo.trim(),
        variacoes: formData.variacoes.filter(v => v.trim()),
        termos_auxiliares: formData.termosAuxiliares,
        tribunais: formData.tribunaisSelecionados
      };

      await criarMonitoramento(body);

      toast({
        title: "Monitoramento criado",
        description: "O monitoramento foi criado com sucesso!"
      });

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

  const handleExcluirMonitoramento = async (id: number) => {
    setLoading(true);
    try {
      await excluirMonitoramento(id);
      toast({
        title: "Monitoramento excluído",
        description: "O monitoramento foi excluído com sucesso!"
      });
      handleCarregarMonitoramentos();
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

  const handleCarregarResultados = async (id: number) => {
    setLoadingResults(true);
    try {
      const data = await carregarResultados(id);
      setProcessosEncontrados(data);
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

  const handleViewDetails = (monitoramento: Monitoramento) => {
    setSelectedMonitoramento(monitoramento);
    setView('details');
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

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {view === 'list' && (
            <MonitoramentosList
              monitoramentos={monitoramentos}
              loading={loading}
              loadingResults={loadingResults}
              onViewDetails={handleViewDetails}
              onViewResults={handleCarregarResultados}
              onDelete={handleExcluirMonitoramento}
              onCreateNew={() => setView('create')}
            />
          )}

          {view === 'create' && (
            <MonitoramentoForm
              loading={loading}
              onSubmit={handleCriarMonitoramento}
            />
          )}

          {view === 'details' && selectedMonitoramento && (
            <MonitoramentoDetails
              monitoramento={selectedMonitoramento}
              loading={loading}
              loadingResults={loadingResults}
              onViewResults={handleCarregarResultados}
              onDelete={handleExcluirMonitoramento}
            />
          )}

          {view === 'results' && (
            <ProcessosResults
              processos={processosEncontrados}
              loadingResults={loadingResults}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoramentoProcessos;
