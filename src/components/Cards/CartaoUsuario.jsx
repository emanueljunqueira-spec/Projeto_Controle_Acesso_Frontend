import React from 'react';
import { Card, Box, Typography, Chip, Button, Avatar } from '@mui/material';
import {
  Delete as DeleteIcon,
  Email as EmailIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';

// Cores baseadas no cargo
const configCargo = {
  administrador: { bg: '#e3f2fd', color: '#1976d2', label: 'ADMIN' },
  gerente: { bg: '#fff7ed', color: '#ea580c', label: 'GERENTE' },
  operador: { bg: '#f0fdf4', color: '#16a34a', label: 'OPERADOR' }
};

export default function CartaoUsuario({ usuario, aoExcluir }) {
  const estilo = configCargo[usuario.cargo] || { bg: '#f3f4f6', color: '#4b5563', label: usuario.cargo };

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
                bgcolor: estilo.color, 
                fontWeight: 'bold',
                width: 48,
                height: 48,
                fontSize: '1.2rem'
              }}
            >
              {usuario.nome.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="700" lineHeight={1.2}>
                {usuario.nome}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5} mt={0.5} color="text.secondary">
                <EmailIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
                  {usuario.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Chip
          icon={<ShieldIcon sx={{ fontSize: '14px !important' }} />}
          label={estilo.label}
          size="small"
          sx={{
            bgcolor: estilo.bg,
            color: estilo.color,
            fontWeight: 'bold',
            fontSize: '0.75rem',
            border: `1px solid ${estilo.color}20`
          }}
        />
      </Box>

      <Button
        variant="outlined"
        color="error"
        size="small"
        fullWidth
        startIcon={<DeleteIcon />}
        onClick={() => aoExcluir(usuario)}
        sx={{ 
          mt: 3, 
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          borderWidth: '1.5px',
          '&:hover': { borderWidth: '1.5px', bgcolor: '#fef2f2' }
        }}
      >
        Remover Acesso
      </Button>
    </Card>
  );
}