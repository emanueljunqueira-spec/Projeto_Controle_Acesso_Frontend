import React from 'react';
import {
  Drawer,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Event as EventIcon
} from '@mui/icons-material';

const LARGURA_MENU = 240;

const itensMenu = [
  { id: 'usuarios', rotulo: 'Usuários', icone: <AdminIcon /> },
  { id: 'participantes', rotulo: 'Participantes', icone: <PeopleIcon /> },
  { id: 'eventos', rotulo: 'Eventos', icone: <EventIcon /> }
];

export default function MenuLateral({ visaoAtual, aoNavegar }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: LARGURA_MENU,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: LARGURA_MENU, boxSizing: 'border-box' }
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {itensMenu.map((item) => (
            <ListItem disablePadding key={item.id}>
              <ListItemButton
                selected={visaoAtual === item.id}
                onClick={() => aoNavegar(item.id)}
              >
                <ListItemIcon>{item.icone}</ListItemIcon>
                <ListItemText primary={item.rotulo} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
}
