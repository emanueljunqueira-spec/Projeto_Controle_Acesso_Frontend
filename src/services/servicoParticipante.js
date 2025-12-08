import api from './api';

const servicoParticipante = {
  // Listar todos os participantes
  async listar() {
    const response = await api.get('/participantes');
    return response.data;
  },

  // Criar novo participante
  async criar(dadosParticipante) {
    const response = await api.post('/participantes', dadosParticipante);
    return response.data;
  },

  // Atualizar participante
  async atualizar(id, dadosParticipante) {
    const response = await api.put(`/participantes/${id}`, dadosParticipante);
    return response.data;
  },

  // Precisa receber: id, emailConfirmacao, senhaConfirmacao
  async excluir(id, emailConfirmacao, senhaConfirmacao) {
    const response = await api.delete(`/participantes/${id}`, {
      // O axios DELETE exige que o corpo vá dentro da propriedade 'data'
      data: { emailConfirmacao, senhaConfirmacao } 
    });
    return response.data;
  },

  // Buscar participante por ID
  async buscarPorId(id) {
    const response = await api.get(`/participantes/${id}`);
    return response.data;
  },

  // Listar participantes por evento
  async listarPorEvento(eventoId) {
    const response = await api.get(`/participantes?evento_id=${eventoId}`);
    return response.data;
  }
};

export default servicoParticipante;
