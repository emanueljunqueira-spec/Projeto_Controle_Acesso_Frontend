import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Cabecalho from './Cabecalho';
import MenuLateral from './MenuLateral';
import { useAutenticacao } from '../../contexts/ContextoAutenticacao';

export default function LayoutPrincipal({ children, visaoAtual, aoNavegar }) {
  const { usuario, sair } = useAutenticacao();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Cabecalho usuario={usuario} aoSair={sair} />

      <MenuLateral visaoAtual={visaoAtual} aoNavegar={aoNavegar} />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
