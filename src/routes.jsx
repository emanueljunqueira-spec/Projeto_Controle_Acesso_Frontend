import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAutenticacao } from './contexts/ContextoAutenticacao';
import PaginaLogin from './pages/PaginaLogin';
import LayoutPrincipal from './components/Layout/LayoutPrincipal';
import PaginaUsuarios from './pages/PaginaUsuarios';
import PaginaParticipantes from './pages/PaginaParticipantes';
import PaginaEventos from './pages/PaginaEventos';
import PaginaMonitor from './pages/PaginaMonitor'; // <--- Importamos a nova página

function RotaProtegida() {
  const { estaAutenticado, carregando } = useAutenticacao();

  if (carregando) return null;
  if (!estaAutenticado) return <Navigate to="/login" replace />;

  return (
    <LayoutPrincipal>
      <Outlet />
    </LayoutPrincipal>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard/usuarios" replace />,
  },
  {
    path: '/login',
    element: <PaginaLogin />,
  },
  {
    path: '/dashboard',
    element: <RotaProtegida />,
    children: [
      { path: 'usuarios', element: <PaginaUsuarios /> },
      { path: 'participantes', element: <PaginaParticipantes /> },
      { path: 'eventos', element: <PaginaEventos /> },
      { path: 'monitor', element: <PaginaMonitor /> }, // <--- ROTA ADICIONADA
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  }
]);