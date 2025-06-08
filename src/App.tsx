
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BuscaEnvolvido from "./components/BuscaEnvolvido";
import BuscaOAB from "./components/BuscaOAB";
import DetalhesProcesso from "./components/DetalhesProcesso";
import StatusAtualizacao from "./components/StatusAtualizacao";
import SolicitarAtualizacao from "./components/SolicitarAtualizacao";
import Movimentacoes from "./components/Movimentacoes";
import MonitoramentoProcessos from "./components/MonitoramentoProcessos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/busca-envolvido" element={<BuscaEnvolvido />} />
          <Route path="/busca-oab" element={<BuscaOAB />} />
          <Route path="/detalhes-processo" element={<DetalhesProcesso />} />
          <Route path="/movimentacoes" element={<Movimentacoes />} />
          <Route path="/status-atualizacao" element={<StatusAtualizacao />} />
          <Route path="/solicitar-atualizacao" element={<SolicitarAtualizacao />} />
          <Route path="/monitoramento-processos" element={<MonitoramentoProcessos />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
