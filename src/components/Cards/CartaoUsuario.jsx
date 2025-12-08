import React from 'react';
import { Paper, Box, Typography, Chip, Button } from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

export default function CartaoUsuario({ usuario, aoExcluir }) {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Dados do Usuário */}
      <Box display="flex" alignItems="center" gap={2}>
        <Box sx={{ bgcolor: '#e3f2fd', p: 1, borderRadius: '50%' }}>
          <AdminIcon color="primary" />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {usuario.nome}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {usuario.email}
          </Typography>
          <Chip label={usuario.cargo} size="small" sx={{ mt: 0.5 }} />
        </Box>
      </Box>

      {/* Botão Excluir */}
      <Button
        variant="outlined"
        color="error"
        fullWidth
        startIcon={<DeleteIcon />}
        onClick={() => aoExcluir(usuario)}
      >
        EXCLUIR USUÁRIO
      </Button>
    </Paper>
  );
}
