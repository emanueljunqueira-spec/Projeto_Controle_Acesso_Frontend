import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Contexto de Mensagens/Notificações
 * Gerencia Snackbars globais para a aplicação
 */
const ContextoMensagem = createContext({});

/**
 * Provider do contexto de mensagens
 */
export function ProvedorMensagem({ children }) {
  const [mensagens, setMensagens] = useState([]);

  /**
   * Adiciona uma nova mensagem à fila
   * @param {string} texto - Texto da mensagem
   * @param {string} tipo - 'sucesso', 'erro', 'aviso', 'info'
   * @param {number} duracao - Tempo em ms antes de fechar (0 = infinito)
   * @returns {string} ID da mensagem
   */
  const adicionar = useCallback((texto, tipo = 'info', duracao = 4000) => {
    const id = Date.now().toString();

    const novaMensagem = {
      id,
      texto,
      tipo,
      duracao,
      aberta: true,
      timestamp: Date.now()
    };

    setMensagens((prev) => [...prev, novaMensagem]);

    // Auto-fechar após duração (se duracao > 0)
    if (duracao > 0) {
      setTimeout(() => {
        fechar(id);
      }, duracao);
    }

    return id;
  }, []);

  /**
   * Fecha uma mensagem específica
   */
  const fechar = useCallback((id) => {
    setMensagens((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, aberta: false } : msg
      )
    );

    // Remove da lista após animação de saída (300ms)
    setTimeout(() => {
      setMensagens((prev) => prev.filter((msg) => msg.id !== id));
    }, 300);
  }, []);

  /**
   * Atalhos rápidos para tipos específicos
   */
  const sucesso = useCallback(
    (texto, duracao = 3000) => adicionar(texto, 'sucesso', duracao),
    [adicionar]
  );

  const erro = useCallback(
    (texto, duracao = 5000) => adicionar(texto, 'erro', duracao),
    [adicionar]
  );

  const aviso = useCallback(
    (texto, duracao = 4000) => adicionar(texto, 'aviso', duracao),
    [adicionar]
  );

  const info = useCallback(
    (texto, duracao = 3000) => adicionar(texto, 'info', duracao),
    [adicionar]
  );

  const valor = {
    mensagens,
    adicionar,
    fechar,
    sucesso,
    erro,
    aviso,
    info
  };

  return (
    <ContextoMensagem.Provider value={valor}>
      {children}
    </ContextoMensagem.Provider>
  );
}

/**
 * Hook personalizado para usar o contexto de mensagens
 * @example
 * const { sucesso, erro, aviso, info } = useMensagem();
 * sucesso('Operação realizada com sucesso!');
 * erro('Ocorreu um erro ao salvar');
 */
export function useMensagem() {
  const contexto = useContext(ContextoMensagem);

  if (!contexto) {
    throw new Error(
      'useMensagem deve ser usado dentro de um ProvedorMensagem'
    );
  }

  return contexto;
}

export default ContextoMensagem;
