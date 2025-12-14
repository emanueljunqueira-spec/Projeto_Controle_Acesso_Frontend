import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography
} from '@mui/material';
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Event as EventIcon,
  Videocam as MonitorIcon
} from '@mui/icons-material';

const LARGURA_MENU = 240;

const itensMenu = [
  { id: 'usuarios', rotulo: 'Usuários', icone: <AdminIcon />, rota: '/dashboard/usuarios' },
  { id: 'participantes', rotulo: 'Participantes', icone: <PeopleIcon />, rota: '/dashboard/participantes' },
  { id: 'eventos', rotulo: 'Eventos', icone: <EventIcon />, rota: '/dashboard/eventos' },
  { id: 'monitor', rotulo: 'Monitor em Tempo Real', icone: <MonitorIcon />, rota: '/dashboard/monitor' }
];

export default function MenuLateral() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determina qual item está ativo baseado na rota atual
  const rotaAtual = location.pathname;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: LARGURA_MENU,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: LARGURA_MENU,
          boxSizing: 'border-box',
          bgcolor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          boxShadow: '4px 0 15px rgba(0, 0, 0, 0.05)'
        }
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2 }}>
        {/* Seção de Menu */}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: '#9ca3af',
            textTransform: 'uppercase',
            fontSize: '11px',
            letterSpacing: '1px',
            mb: 1.5,
            display: 'block'
          }}
        >
          Menu
        </Typography>

        <List sx={{ p: 0 }}>
          {itensMenu.map((item) => {
            const isActive = rotaAtual === item.rota;
            return (
              <ListItem disablePadding key={item.id}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => navigate(item.rota)}
                  sx={{
                    mb: 0.75,
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    py: 1.25,
                    px: 1.5,
                    '&.Mui-selected': {
                      bgcolor: '#eff6ff',
                      color: '#1976d2',
                      fontWeight: 600,
                      borderLeft: '4px solid #1976d2',
                      pl: 1.25,
                      '& .MuiListItemIcon-root': {
                        color: '#1976d2'
                      },
                      '&:hover': {
                        bgcolor: '#e0eeff'
                      }
                    },
                    '&:not(.Mui-selected)': {
                      color: '#6b7280',
                      '& .MuiListItemIcon-root': {
                        color: '#9ca3af'
                      },
                      '&:hover': {
                        bgcolor: '#f9fafb',
                        color: '#374151'
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icone}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.rotulo}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '14px'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 2, borderColor: '#f3f4f6' }} />

        {/* Dica ou Footer */}
        <Typography
          variant="caption"
          sx={{
            color: '#9ca3af',
            fontSize: '12px',
            display: 'block',
            mt: 2,
            p: 1.5,
            bgcolor: '#f9fafb',
            borderRadius: '8px',
            lineHeight: 1.5
          }}
        >
          💡 Use o menu para navegar entre as seções do sistema.
        </Typography>
      </Box>
    </Drawer>
  );
}
