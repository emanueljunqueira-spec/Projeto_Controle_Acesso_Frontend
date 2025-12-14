import React from 'react';
// 1. Adicionado Outlet na importação
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ProvedorAutenticacao, useAutenticacao } from './contexts/ContextoAutenticacao';
import { ProvedorMensagem } from './contexts/ContextoMensagem';
import SnackbarNotificacao from './components/SnackbarNotificacao';

import LayoutPrincipal from './components/Layout/LayoutPrincipal';
import PaginaLogin from './pages/PaginaLogin';
import PaginaUsuarios from './pages/PaginaUsuarios';
import PaginaParticipantes from './pages/PaginaParticipantes';
import PaginaEventos from './pages/PaginaEventos';
// Se tiveres a página de monitor, importa-a também (opcional)
import PaginaMonitor from './pages/PaginaMonitor'; 

import './App.css';

function RotaPrivada({ children }) {
  const { estaAutenticado, carregando } = useAutenticacao();
  if (carregando) return null;
  if (!estaAutenticado) return <Navigate to="/login" />;
  return children;
}

function RotaPublica({ children }) {
  const { estaAutenticado, carregando } = useAutenticacao();
  if (carregando) return null;
  if (estaAutenticado) return <Navigate to="/dashboard/usuarios" />;
  return children;
}

export default function App() {
  return (
    <ProvedorMensagem>
      <ProvedorAutenticacao>
        <BrowserRouter>
          <SnackbarNotificacao />
          
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/login" element={
              <RotaPublica>
                <PaginaLogin />
              </RotaPublica>
            } />

            {/* Rota do Dashboard (CORRIGIDA) */}
            <Route path="/dashboard" element={
              <RotaPrivada>
                <LayoutPrincipal>
                  {/* 2. O Outlet diz onde desenhar as páginas filhas */}
                  <Outlet />
                </LayoutPrincipal>
              </RotaPrivada>
            }>
              <Route path="usuarios" element={<PaginaUsuarios />} />
              <Route path="participantes" element={<PaginaParticipantes />} />
              <Route path="eventos" element={<PaginaEventos />} />
              <Route path="monitor" element={<PaginaMonitor />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </ProvedorAutenticacao>
    </ProvedorMensagem>
  );
}