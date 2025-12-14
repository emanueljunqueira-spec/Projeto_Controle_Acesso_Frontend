/**
 * GUIA: Como usar o Sistema de Mensagens
 * 
 * O sistema de mensagens substitui todos os alert() pela elegância de Snackbars
 * Mensagens aparecem no canto superior direito com animação suave
 */

// ============================================================================
// EXEMPLO 1: Uso básico em um componente
// ============================================================================

import React from 'react';
import { Button } from '@mui/material';
import { useMensagem } from '../contexts/ContextoMensagem';

function MeuComponente() {
  const { sucesso, erro, aviso, info } = useMensagem();

  const handleSalvar = async () => {
    try {
      // ... fazer algo ...
      sucesso('Dados salvos com sucesso! 🎉');
    } catch (err) {
      erro('Erro ao salvar dados: ' + err.message);
    }
  };

  const handleExemplos = () => {
    sucesso('Esta é uma mensagem de sucesso');
    erro('Esta é uma mensagem de erro');
    aviso('Esta é uma mensagem de aviso');
    info('Esta é uma mensagem de informação');
  };

  return (
    <div>
      <Button onClick={handleSalvar}>Salvar</Button>
      <Button onClick={handleExemplos}>Ver Exemplos</Button>
    </div>
  );
}

// ============================================================================
// EXEMPLO 2: Customização de duração
// ============================================================================

import { useMensagem } from '../contexts/ContextoMensagem';

function OutroComponente() {
  const { sucesso, erro, adicionar } = useMensagem();

  // Mensagem rápida (2 segundos)
  const mostrarRapido = () => {
    sucesso('Mensagem rápida', 2000);
  };

  // Mensagem lenta (10 segundos)
  const mostrarLento = () => {
    erro('Este erro permanecerá por 10 segundos', 10000);
  };

  // Mensagem permanente (sem fechar automaticamente)
  const mostrarPermanente = () => {
    adicionar('Clique o X para fechar', 'aviso', 0);
  };

  return <div>{/* ... */}</div>;
}

// ============================================================================
// EXEMPLO 3: Com tratamento de erros
// ============================================================================

import { useMensagem } from '../contexts/ContextoMensagem';

function ComponenteComAPI() {
  const { sucesso, erro } = useMensagem();

  const buscarDados = async () => {
    try {
      const resposta = await fetch('/api/dados');
      
      if (!resposta.ok) {
        throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
      }

      const dados = await resposta.json();
      sucesso(`Carregados ${dados.length} registros!`);
      return dados;

    } catch (err) {
      // Mensagens customizadas por tipo de erro
      if (err.message.includes('401')) {
        erro('Sua sessão expirou. Faça login novamente.');
      } else if (err.message.includes('500')) {
        erro('Erro do servidor. Tente mais tarde.');
      } else {
        erro(err.message);
      }
    }
  };

  return <div>{/* ... */}</div>;
}

// ============================================================================
// EXEMPLO 4: Sequência de mensagens
// ============================================================================

import { useMensagem } from '../contexts/ContextoMensagem';

function ProcessoComMultiplasEtapas() {
  const { info, sucesso, erro } = useMensagem();

  const processarDados = async () => {
    try {
      info('Iniciando processamento...');
      
      // Etapa 1
      await new Promise((resolve) => setTimeout(resolve, 1000));
      info('Etapa 1 concluída');
      
      // Etapa 2
      await new Promise((resolve) => setTimeout(resolve, 1000));
      info('Etapa 2 concluída');
      
      // Sucesso final
      sucesso('Processamento concluído! ✓');

    } catch (err) {
      erro('Falha no processamento');
    }
  };

  return <div>{/* ... */}</div>;
}

// ============================================================================
// TIPOS DE MENSAGENS DISPONÍVEIS
// ============================================================================

// const { adicionar, sucesso, erro, aviso, info } = useMensagem();
//
// 1. adicionar(texto, tipo, duracao)
//    - Função base, mais flexível
//    - Tipos: 'sucesso', 'erro', 'aviso', 'info'
//    - Duração em ms (0 = infinito)
//
// 2. sucesso(texto, duracao)
//    - Verde (sucesso)
//    - Padrão: 3 segundos
//
// 3. erro(texto, duracao)
//    - Vermelho (erro)
//    - Padrão: 5 segundos
//
// 4. aviso(texto, duracao)
//    - Laranja (aviso)
//    - Padrão: 4 segundos
//
// 5. info(texto, duracao)
//    - Azul (info)
//    - Padrão: 3 segundos

// ============================================================================
// INTEGRAÇÃO NA APP
// ============================================================================

/*
  ESTRUTURA CORRETA EM App.js:

  <ProvedorMensagem>
    <ProvedorAutenticacao>
      <SnackbarNotificacao />  (← Renderiza as notificações)
      <RouterProvider router={router} />
    </ProvedorAutenticacao>
  </ProvedorMensagem>
*/

// ============================================================================
// BOAS PRÁTICAS
// ============================================================================

/*
  ✓ DO's (faça):
  - Use mensagens claras e curtas
  - Personalize durações por tipo (erros mais longos)
  - Use emojis para melhor visualização
  - Sempre trate erros com try/catch
  - Use em operações assíncronas (API calls)

  ✗ DON'Ts (evite):
  - Não use alert() (deprecated em favor do sistema)
  - Não mostre mensagens técnicas complexas
  - Não use muitas mensagens simultâneas (confunde)
  - Não deixe mensagens de erro sem contexto
*/

// ============================================================================
// EXEMPLO REAL: Refatorar PaginaLogin
// ============================================================================

import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useAutenticacao } from '../contexts/ContextoAutenticacao';
import { useMensagem } from '../contexts/ContextoMensagem';
import { formatarErro } from '../utils/errorHandler';

export function PaginaLoginRefatorada() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { login } = useAutenticacao();
  const { sucesso, erro } = useMensagem();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      erro('Preencha email e senha');
      return;
    }

    setCarregando(true);

    try {
      await login(email, senha);
      sucesso('Login realizado com sucesso! 🎉');
      // Redirecionamento automático via router
    } catch (err) {
      erro(formatarErro(err)); // Sem alert()!
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <TextField
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={carregando}
      />
      <TextField
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        disabled={carregando}
      />
      <Button type="submit" disabled={carregando}>
        Acessar
      </Button>
    </form>
  );
}

// ============================================================================
export default {};
