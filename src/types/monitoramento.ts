
export interface TermoAuxiliar {
  condicao: 'CONTEM' | 'NAO_CONTEM' | 'CONTEM_ALGUMA';
  termo: string;
}

export interface NovoMonitoramento {
  termo: string;
  variacoes: string[];
  termos_auxiliares: TermoAuxiliar[];
  tribunais: string[];
}

export interface Monitoramento {
  id: number;
  termo: string;
  tipo?: string;
  criado_em: string;
  variacoes: string[];
  termos_auxiliares: {
    CONTEM?: string[];
    NAO_CONTEM?: string[];
    CONTEM_ALGUMA?: string[];
  };
  tribunais_especificos: string[];
}

export interface ProcessoEncontrado {
  numero_cnj: string;
  data_inicio: string;
  tribunal: string;
  match: string;
  estado_origem: {
    nome: string;
    sigla: string;
  };
}
