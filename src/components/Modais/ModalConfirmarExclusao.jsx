import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Typography
} from '@mui/material';
import {
  Warning as WarningIcon,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useMensagem } from '../../contexts/ContextoMensagem';

export default function ModalConfirmarExclusao({ aberto, aoFechar, nomeItem, aoConfirmar }) {
  const { aviso } = useMensagem();
  const [emailConfirmacao, setEmailConfirmacao] = useState('');
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');

  const handleConfirmar = () => {
    if (!emailConfirmacao || !senhaConfirmacao) {
      aviso('Por favor, digite seu e-mail e senha para confirmar a exclusão.');
      return;
    }
    aoConfirmar(emailConfirmacao, senhaConfirmacao);
    limparCampos();
  };

  const handleFechar = () => {
    limparCampos();
    aoFechar();
  };

  const limparCampos = () => {
    setEmailConfirmacao('');
    setSenhaConfirmacao('');
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
          color: '#ef4444',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pb: 1,
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <WarningIcon sx={{ fontSize: 28 }} />
        Confirmar Exclusão
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Alert
          severity="error"
          sx={{
            mb: 2.5,
            bgcolor: '#fef2f2',
            border: '1px solid #fecaca',
            '& .MuiAlert-icon': {
              color: '#ef4444'
            }
          }}
        >
          <Box>
            <Typography fontWeight={700} fontSize="14px" mb={0.5}>
              Esta ação é irreversível!
            </Typography>
            <Typography fontSize="12px">
              Você está prestes a excluir <strong>{nomeItem}</strong> e todos os dados relacionados.
            </Typography>
          </Box>
        </Alert>

        <Typography
          variant="body2"
          sx={{
            color: '#374151',
            fontWeight: 600,
            mb: 2,
            fontSize: '14px'
          }}
        >
          Para sua segurança, confirme suas credenciais de Administrador:
        </Typography>

        {/* Email */}
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <EmailIcon sx={{ color: '#1976d2' }} />
          <TextField
            autoFocus
            label="Seu E-mail de Administrador"
            type="email"
            fullWidth
            variant="outlined"
            placeholder="admin@example.com"
            value={emailConfirmacao}
            onChange={(e) => setEmailConfirmacao(e.target.value)}
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

        {/* Senha */}
        <Box display="flex" alignItems="center" gap={1}>
          <LockIcon sx={{ color: '#ef4444' }} />
          <TextField
            label="Sua Senha"
            type="password"
            fullWidth
            variant="outlined"
            placeholder="Digite sua senha"
            value={senhaConfirmacao}
            onChange={(e) => setSenhaConfirmacao(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&:hover fieldset': {
                  borderColor: '#ef4444'
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
          onClick={handleConfirmar}
          variant="contained"
          color="error"
          disabled={!emailConfirmacao || !senhaConfirmacao}
          sx={{
            bgcolor: '#ef4444',
            color: '#ffffff',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '8px',
            px: 3,
            transition: 'all 0.2s ease',
            '&:hover:not(:disabled)': {
              bgcolor: '#dc2626',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(239, 68, 68, 0.3)'
            },
            '&:disabled': {
              opacity: 0.6,
              cursor: 'not-allowed'
            }
          }}
        >
          CONFIRMAR EXCLUSÃO
        </Button>
      </DialogActions>
    </Dialog>
  );
}