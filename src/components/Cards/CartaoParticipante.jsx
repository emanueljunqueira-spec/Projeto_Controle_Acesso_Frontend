import React from 'react';
import { Card, Box, Typography, Chip, Button, Avatar } from '@mui/material';
import {
  Delete as DeleteIcon,
  Badge as BadgeIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';

export default function CartaoParticipante({ participante, aoExcluir }) {
  const ativo = participante.status;

  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
          borderColor: '#d1d5db'
        }
      }}
    >
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" gap={2} alignItems="center">
            <Avatar 
              sx={{ 
                bgcolor: ativo ? '#22c55e' : '#9ca3af', 
                fontWeight: 'bold',
                width: 48,
                height: 48
              }}
            >
              {participante.nome.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="700" lineHeight={1.2}>
                {participante.nome}
              </Typography>
              <Typography variant="caption" color="textSecondary" display="block" mt={0.5}>
                {participante.email || 'Sem e-mail cadastrado'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip
            icon={ativo ? <ActiveIcon sx={{ fontSize: '14px !important' }} /> : <InactiveIcon sx={{ fontSize: '14px !important' }} />}
            label={ativo ? 'CADASTRO ATIVO' : 'INATIVO'}
            size="small"
            sx={{
              bgcolor: ativo ? '#f0fdf4' : '#f3f4f6',
              color: ativo ? '#16a34a' : '#6b7280',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              border: `1px solid ${ativo ? '#16a34a' : '#9ca3af'}20`
            }}
          />
          
          {participante.evento && (
            <Chip 
              icon={<BadgeIcon sx={{ fontSize: '14px !important' }} />}
              label={participante.evento.titulo} 
              size="small" 
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      <Button
        variant="outlined"
        color="error"
        size="small"
        fullWidth
        startIcon={<DeleteIcon />}
        onClick={() => aoExcluir(participante)}
        sx={{ 
          mt: 3, 
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          borderWidth: '1.5px',
          '&:hover': { borderWidth: '1.5px', bgcolor: '#fef2f2' }
        }}
      >
        Excluir
      </Button>
    </Card>
  );
}