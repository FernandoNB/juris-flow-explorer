
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, UserCheck, Scale, FileText, RefreshCw, Eye } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: UserCheck,
      title: "Busca por Envolvido",
      description: "Encontre processos por nome ou CPF/CNPJ do envolvido",
      link: "/busca-envolvido",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Scale,
      title: "Busca por OAB",
      description: "Consulte processos por número da OAB e estado",
      link: "/busca-oab",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: FileText,
      title: "Detalhes do Processo",
      description: "Visualize informações completas usando número CNJ",
      link: "/detalhes-processo",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Search,
      title: "Movimentações",
      description: "Acompanhe todas as movimentações de um processo",
      link: "/movimentacoes",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: Eye,
      title: "Status de Atualização",
      description: "Verifique o status de atualização de processos",
      link: "/status-atualizacao",
      color: "from-green-500 to-green-600"
    },
    {
      icon: RefreshCw,
      title: "Solicitar Atualização",
      description: "Solicite a atualização de dados de um processo",
      link: "/solicitar-atualizacao",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Escavador Manager</h1>
                <p className="text-sm text-slate-600">Sistema de consultas processuais</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Consulte Processos Judiciais com
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Facilidade</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Acesse informações completas sobre processos judiciais através da API V2 do Escavador. 
            Interface intuitiva, dados seguros e atualizações em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/busca-envolvido"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Começar Consulta
            </Link>
            <a 
              href="#funcionalidades"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Ver Funcionalidades
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="funcionalidades" className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Funcionalidades Disponíveis</h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore todas as ferramentas disponíveis para consulta e gerenciamento de processos judiciais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-200 transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                Acessar
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-slate-600">
            <p>© 2024 Escavador Manager. Desenvolvido para facilitar consultas processuais.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
