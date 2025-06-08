
import { API_CONFIG } from '@/config/api';
import { NovoMonitoramento } from '@/types/monitoramento';

const API_BASE_URL = 'https://api.escavador.com/api/v2/monitoramentos/novos-processos';

const getHeaders = () => ({
  'Authorization': `Bearer ${API_CONFIG.ESCAVADOR_TOKEN}`,
  'X-Requested-With': 'XMLHttpRequest',
  'Accept': 'application/json',
  'Content-Type': 'application/json',
});

export const carregarMonitoramentos = async () => {
  const response = await fetch(API_BASE_URL, {
    method: 'GET',
    headers: getHeaders(),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao carregar monitoramentos');
  }

  return data.items || [];
};

export const criarMonitoramento = async (body: NovoMonitoramento) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body)
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao criar monitoramento');
  }

  return data;
};

export const excluirMonitoramento = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Erro ao excluir monitoramento');
  }
};

export const carregarResultados = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/${id}/resultados`, {
    method: 'GET',
    headers: getHeaders(),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao carregar resultados');
  }

  return data.items || [];
};
