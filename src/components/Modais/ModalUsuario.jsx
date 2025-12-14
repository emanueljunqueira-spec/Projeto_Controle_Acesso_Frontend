import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';

export default function ModalUsuario({ aberto, aoFechar, aoSalvar }) {
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    cargo: 'operador'
  });

  const handleSalvar = () => {
    aoSalvar(novoUsuario);
    setNovoUsuario({ nome: '', email: '', senha: '', cargo: 'operador' });
  };

  const handleFechar = () => {
    setNovoUsuario({ nome: '', email: '', senha: '', cargo: 'operador' });
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
        👤 Novo Usuário
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Nome */}
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <PersonIcon sx={{ color: '#1976d2' }} />
          <TextField
            autoFocus
            label="Nome Completo"
            fullWidth
            variant="outlined"
            placeholder="Digite o nome"
            value={novoUsuario.nome}
            onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
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

        {/* Email */}
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <EmailIcon sx={{ color: '#22c55e' }} />
          <TextField
            label="E-mail"
            fullWidth
            variant="outlined"
            placeholder="usuario@example.com"
            value={novoUsuario.email}
            onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
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

        {/* Senha */}
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <LockIcon sx={{ color: '#f59e0b' }} />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            variant="outlined"
            placeholder="Min. 6 caracteres"
            value={novoUsuario.senha}
            onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&:hover fieldset': {
                  borderColor: '#f59e0b'
                }
              }
            }}
          />
        </Box>

        {/* Cargo */}
        <Box display="flex" alignItems="center" gap={1}>
          <ShieldIcon sx={{ color: '#ef4444' }} />
          <FormControl fullWidth>
            <InputLabel>Cargo</InputLabel>
            <Select
              value={novoUsuario.cargo}
              label="Cargo"
              onChange={(e) => setNovoUsuario({ ...novoUsuario, cargo: e.target.value })}
              sx={{
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#ef4444'
                  }
                }
              }}
            >
              <MenuItem value="operador">
                <Typography fontSize="14px">📋 Operador</Typography>
              </MenuItem>
              <MenuItem value="gerente">
                <Typography fontSize="14px">👨‍💼 Gerente</Typography>
              </MenuItem>
              <MenuItem value="administrador">
                <Typography fontSize="14px">👨‍💻 Administrador</Typography>
              </MenuItem>
            </Select>
          </FormControl>
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
            bgcolor: '#1976d2',
            color: '#ffffff',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '8px',
            px: 3,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: '#1565c0',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)'
            }
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
