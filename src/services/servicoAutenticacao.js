import api from './api';

const servicoAutenticacao = {
  // Realizar login
  async login(email, senha) {
    const response = await api.post('/sessoes', { email, senha });
    const { token, usuario } = response.data;

    localStorage.setItem('rfid_token', token);
    localStorage.setItem('rfid_user', JSON.stringify(usuario));

    return { token, usuario };
  },

  // Realizar logout
  sair() {
    localStorage.removeItem('rfid_token');
    localStorage.removeItem('rfid_user');
  },

  // Obter token armazenado
  obterToken() {
    return localStorage.getItem('rfid_token');
  },

  // Obter usuário armazenado
  obterUsuario() {
    const usuario = localStorage.getItem('rfid_user');
    return usuario ? JSON.parse(usuario) : null;
  },

  // Verificar se está autenticado
  estaAutenticado() {
    return !!this.obterToken();
  }
};

export default servicoAutenticacao;
