import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { useMensagem } from '../../contexts/ContextoMensagem';

export default function ModalParticipante({ aberto, aoFechar, aoSalvar }) {
  const { aviso } = useMensagem();
  const [novoParticipante, setNovoParticipante] = useState({ nome: '', email: '' });

  const handleSalvar = () => {
    if (!novoParticipante.email || !novoParticipante.email.includes('@')) {
      aviso('O e-mail é obrigatório e deve ser válido.');
      return;
    }
    aoSalvar({ ...novoParticipante, status: true });
    setNovoParticipante({ nome: '', email: '' });
  };

  const handleFechar = () => {
    setNovoParticipante({ nome: '', email: '' });
    aoFechar();
  };

  return (
    <Dialog
      open={aberto}
      onClose={handleFechar}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: '#1a1a1a',
          fontSize: '20px',
          pb: 1,
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        👥 Novo Participante
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Alert
          severity="info"
          sx={{
            mb: 2.5,
            bgcolor: '#eff6ff',
            color: '#1976d2',
            border: '1px solid #1976d233',
            '& .MuiAlert-icon': {
              color: '#1976d2'
            }
          }}
        >
          Digite os dados do novo participante. O e-mail é obrigatório e deve ser válido.
        </Alert>

        {/* Nome */}
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <PersonIcon sx={{ color: '#22c55e' }} />
          <TextField
            autoFocus
            label="Nome Completo"
            fullWidth
            variant="outlined"
            placeholder="Digite o nome"
            value={novoParticipante.nome}
            onChange={(e) => setNovoParticipante({ ...novoParticipante, nome: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&:hover fieldset': {
                  borderColor: '#22c55e'
                }
              }
            }}
          />
        </Box>

        {/* Email */}
        <Box display="flex" alignItems="center" gap={1}>
          <EmailIcon sx={{ color: '#1976d2' }} />
          <TextField
            label="E-mail (Obrigatório)"
            fullWidth
            variant="outlined"
            placeholder="usuario@example.com"
            value={novoParticipante.email}
            onChange={(e) => setNovoParticipante({ ...novoParticipante, email: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&:hover fieldset': {
                  borderColor: '#1976d2'
                }
              }
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          gap: 1,
          borderTop: '1px solid #e5e7eb'
        }}
      >
        <Button
          onClick={handleFechar}
          sx={{
            color: '#6b7280',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '8px',
            '&:hover': {
              bgcolor: '#f3f4f6'
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSalvar}
          variant="contained"
          sx={{
            bgcolor: '#22c55e',
            color: '#ffffff',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '8px',
            px: 3,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: '#16a34a',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(34, 197, 94, 0.3)'
            }
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
