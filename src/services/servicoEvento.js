import api from './api';

const servicoEvento = {
  async listar() {
    const resp = await api.get('/eventos');
    return resp.data;
  },
  async criar(dados) {
    const resp = await api.post('/eventos', dados);
    return resp.data;
  },
  async atualizar(id, dados) {
    const resp = await api.put(`/eventos/${id}`, dados);
    return resp.data;
  },
  async excluir(id, emailConfirmacao, senhaConfirmacao) {
    const resp = await api.delete(`/eventos/${id}`, {
      data: { emailConfirmacao, senhaConfirmacao } 
    });
    return resp.data;
  }
};

export default servicoEvento;
