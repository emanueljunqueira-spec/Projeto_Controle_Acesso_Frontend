import React from 'react';
import { Paper, Box, Typography, Chip, Button } from '@mui/material';
import { People as PeopleIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function CartaoParticipante({ participante, aoExcluir }) {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Dados do Participante */}
      <Box display="flex" alignItems="center" gap={2}>
        <Box sx={{ bgcolor: '#e8f5e9', p: 1, borderRadius: '50%' }}>
          <PeopleIcon color="success" />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {participante.nome}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {participante.email || 'Sem e-mail'}
          </Typography>
          <Chip
            label={participante.status ? 'ATIVO' : 'INATIVO'}
            size="small"
            color={participante.status ? 'success' : 'error'}
            sx={{ mt: 0.5 }}
          />
        </Box>
      </Box>

      {/* Botão Excluir */}
      <Button
        variant="outlined"
        color="error"
        fullWidth
        startIcon={<DeleteIcon />}
        onClick={() => aoExcluir(participante)}
      >
        EXCLUIR PARTICIPANTE
      </Button>
    </Paper>
  );
}
