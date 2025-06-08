
import { TermoAuxiliar } from '@/types/monitoramento';

export const formatTermosAuxiliares = (termosAuxiliares: any): TermoAuxiliar[] => {
  if (!termosAuxiliares || typeof termosAuxiliares !== 'object') return [];
  
  const result: TermoAuxiliar[] = [];
  if (termosAuxiliares.CONTEM) {
    result.push(...termosAuxiliares.CONTEM.map((termo: string) => ({ condicao: 'CONTEM', termo })));
  }
  if (termosAuxiliares.NAO_CONTEM) {
    result.push(...termosAuxiliares.NAO_CONTEM.map((termo: string) => ({ condicao: 'NAO_CONTEM', termo })));
  }
  if (termosAuxiliares.CONTEM_ALGUMA) {
    result.push(...termosAuxiliares.CONTEM_ALGUMA.map((termo: string) => ({ condicao: 'CONTEM_ALGUMA', termo })));
  }
  return result;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const cleanHtmlTags = (htmlString: string) => {
  return htmlString.replace(/<[^>]*>/g, '');
};

export const consultarProcesso = (numeroCNJ: string, acao: 'detalhes' | 'movimentacoes') => {
  const url = acao === 'detalhes' 
    ? `/detalhes-processo?numero=${numeroCNJ}`
    : `/movimentacoes?numero=${numeroCNJ}`;
  window.location.href = url;
};
