import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';

export default function Cabecalho({ usuario, aoSair }) {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          RFID Manager
        </Typography>
        <Typography variant="body2" sx={{ mr: 2 }}>
          Olá, <strong>{usuario?.nome}</strong>
        </Typography>
        <Button color="inherit" startIcon={<LogoutIcon />} onClick={aoSair}>
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
}
