import React, { createContext, useState, useContext, useEffect } from 'react';
import servicoAutenticacao from '../services/servicoAutenticacao';

// Criar o contexto
const ContextoAutenticacao = createContext({});

// Provider do contexto
export function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Verificar se há usuário salvo ao iniciar
  useEffect(() => {
    const tokenSalvo = servicoAutenticacao.obterToken();
    const usuarioSalvo = servicoAutenticacao.obterUsuario();

    if (tokenSalvo && usuarioSalvo) {
      setToken(tokenSalvo);
      setUsuario(usuarioSalvo);
    }

    setCarregando(false);
  }, []);

  // Função de login
  const login = async (email, senha) => {
    const { token: novoToken, usuario: novoUsuario } = await servicoAutenticacao.login(email, senha);
    setToken(novoToken);
    setUsuario(novoUsuario);
    return novoUsuario;
  };

  // Função de logout
  const sair = () => {
    servicoAutenticacao.sair();
    setToken(null);
    setUsuario(null);
  };

  // Verificar se está autenticado
  const estaAutenticado = !!token && !!usuario;

  // Verificar se é administrador
  const ehAdmin = usuario?.cargo === 'administrador';

  // Valor do contexto
  const valor = {
    usuario,
    token,
    carregando,
    estaAutenticado,
    ehAdmin,
    login,
    sair
  };

  return (
    <ContextoAutenticacao.Provider value={valor}>
      {children}
    </ContextoAutenticacao.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useAutenticacao() {
  const contexto = useContext(ContextoAutenticacao);

  if (!contexto) {
    throw new Error('useAutenticacao deve ser usado dentro de um ProvedorAutenticacao');
  }

  return contexto;
}

export default ContextoAutenticacao;
