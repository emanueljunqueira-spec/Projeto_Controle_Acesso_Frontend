import React, { useState } from 'react';
import { ProvedorAutenticacao, useAutenticacao } from './contexts/ContextoAutenticacao';
import LayoutPrincipal from './components/Layout/LayoutPrincipal';
import PaginaLogin from './pages/PaginaLogin';
import PaginaUsuarios from './pages/PaginaUsuarios';
import PaginaParticipantes from './pages/PaginaParticipantes';
import PaginaEventos from './pages/PaginaEventos';

import './App.css';

// Componente interno que usa o contexto
function ConteudoApp() {
  const { estaAutenticado, carregando } = useAutenticacao();
  const [visaoAtual, setVisaoAtual] = useState('usuarios');

  // Mostra loading enquanto verifica autenticação
  if (carregando) {
    return null;
  }

  // Se não está autenticado, mostra login
  if (!estaAutenticado) {
    return <PaginaLogin />;
  }

  // Se está autenticado, mostra o dashboard
  return (
    <LayoutPrincipal visaoAtual={visaoAtual} aoNavegar={setVisaoAtual}>
      {visaoAtual === 'usuarios' && <PaginaUsuarios />}
      {visaoAtual === 'participantes' && <PaginaParticipantes />}
      {visaoAtual === 'eventos' && <PaginaEventos />}
    </LayoutPrincipal>
  );
}

// Componente principal com o Provider
export default function App() {
  return (
    <ProvedorAutenticacao>
      <ConteudoApp />
    </ProvedorAutenticacao>
  );
}