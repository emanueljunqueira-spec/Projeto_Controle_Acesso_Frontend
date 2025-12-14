import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton } from '@mui/material';
import { Logout as LogoutIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useMensagem } from '../../contexts/ContextoMensagem'; // <--- Padronizado

// Função auxiliar para pegar as iniciais
function getIniciais(nome) {
  if (!nome) return 'UR';
  return nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

// Cores baseadas no cargo
function getCorAvatar(cargo) {
  switch (cargo) {
    case 'administrador': return '#1976d2'; // Azul
    case 'gerente': return '#ed6c02';       // Laranja
    case 'operador': return '#2e7d32';      // Verde
    default: return '#757575';              // Cinza
  }
}

export default function Cabecalho({ usuario, aoSair, aoAlternarMenu }) {
  // Usamos o nosso contexto personalizado agora
  const { info } = useMensagem();

  const handleLogout = () => {
    info('Sessão encerrada. Até logo!');
    aoSair();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#ffffff', // Branco limpo (Enterprise Design)
        color: '#333',      // Texto escuro para contraste
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}
    >
      <Toolbar>
        {/* Menu Hamburguer (Mobile) */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={aoAlternarMenu}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#1976d2' }}>
          RFID Control
        </Typography>

        {/* Perfil */}
        <Box display="flex" alignItems="center" gap={2}>
          <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" fontWeight="bold">
              {usuario?.nome || 'Usuário'}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase' }}>
              {usuario?.cargo || 'Visitante'}
            </Typography>
          </Box>

          <Avatar 
            sx={{ 
              bgcolor: getCorAvatar(usuario?.cargo),
              width: 35, 
              height: 35,
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}
          >
            {getIniciais(usuario?.nome)}
          </Avatar>

          <Button 
            color="error" 
            variant="outlined" 
            size="small"
            startIcon={<LogoutIcon />} 
            onClick={handleLogout}
            sx={{ ml: 1, borderRadius: 20, textTransform: 'none' }}
          >
            Sair
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}