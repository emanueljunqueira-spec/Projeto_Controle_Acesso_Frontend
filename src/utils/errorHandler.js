/**
 * Formata erros da API para exibição amigável
 * @param {Error} err - Objeto de erro do axios
 * @returns {string} - Mensagem de erro formatada
 */
export const formatarErro = (err) => {
  // Erro com mensagem única
  if (err.response?.data?.error) {
    return err.response.data.error;
  }

  // Erros de validação (array de erros)
  if (err.response?.data?.errors) {
    const erros = err.response.data.errors;
    
    // Se for array de objetos com field e message
    if (Array.isArray(erros)) {
      return erros.map(e => e.message || e).join('\n');
    }
    
    // Se for objeto com arrays de mensagens
    if (typeof erros === 'object') {
      return Object.values(erros)
        .map(e => (Array.isArray(e) ? e[0] : e))
        .join('\n');
    }
  }

  // Erro de rede
  if (err.code === 'ERR_NETWORK') {
    return 'Erro de conexão. Verifique se o servidor está online.';
  }

  // Erro genérico
  return err.message || 'Erro desconhecido';
};

/**
 * Verifica se o usuário tem permissão de administrador
 * @param {object} usuario - Objeto do usuário
 * @returns {boolean}
 */
export const ehAdmin = (usuario) => {
  return usuario?.cargo === 'administrador';
};

/**
 * Valida se pode excluir um item
 * @param {object} usuarioAtual - Usuário logado
 * @param {object} itemAlvo - Item a ser excluído
 * @param {string} tipo - Tipo do item ('usuario' ou 'participante')
 * @returns {{ permitido: boolean, mensagem: string }}
 */
export const podeExcluir = (usuarioAtual, itemAlvo, tipo) => {
  if (!ehAdmin(usuarioAtual)) {
    return {
      permitido: false,
      mensagem: `Ação bloqueada! Seu cargo atual é '${usuarioAtual.cargo}'. Apenas 'administrador' pode excluir.`
    };
  }

  if (tipo === 'usuario' && itemAlvo.cargo === 'administrador') {
    return {
      permitido: false,
      mensagem: 'Segurança: Você não pode excluir outro Administrador.'
    };
  }

  return { permitido: true, mensagem: '' };
};

export default { formatarErro, ehAdmin, podeExcluir };
