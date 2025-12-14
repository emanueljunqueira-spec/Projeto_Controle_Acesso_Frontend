import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Cabecalho from './Cabecalho';
import MenuLateral from './MenuLateral';
import { useAutenticacao } from '../../contexts/ContextoAutenticacao';

/**
 * Layout Principal do Dashboard
 * Fornece a estrutura comum: Header, Sidebar e área de conteúdo
 * Nova paleta: fundo #f4f6f8, cards brancos, shadows suaves
 */
export default function LayoutPrincipal({ children }) {
  const { usuarioLogado, sair } = useAutenticacao();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <CssBaseline />

      {/* Header */}
      <Cabecalho usuario={usuarioLogado} aoSair={sair} />

      {/* Sidebar */}
      <MenuLateral />

      {/* Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          bgcolor: '#f4f6f8',
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar /> {/* Espaço para o header fixo */}
        {children}
      </Box>
    </Box>
  );
}
