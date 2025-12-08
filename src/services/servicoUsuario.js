import api from './api';

const servicoUsuario = {
  // Listar todos os usuários
  async listar() {
    const response = await api.get('/usuarios');
    return response.data;
  },

  // Criar novo usuário
  async criar(dadosUsuario) {
    const response = await api.post('/usuarios', dadosUsuario);
    return response.data;
  },

  // Atualizar usuário
  async atualizar(id, dadosUsuario) {
    const response = await api.put(`/usuarios/${id}`, dadosUsuario);
    return response.data;
  },

  // Excluir usuário
  // Excluir usuário (Agora com e-mail)
  async excluir(id, emailConfirmacao, senhaConfirmacao) {
    const response = await api.delete(`/usuarios/${id}`, {
      data: { emailConfirmacao, senhaConfirmacao } // <--- Mudou aqui
    });
    return response.data;
  },

  // Buscar usuário por ID
  async buscarPorId(id) {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  }
};

export default servicoUsuario;
