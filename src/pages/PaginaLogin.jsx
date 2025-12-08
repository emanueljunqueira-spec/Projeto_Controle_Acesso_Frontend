import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import { useAutenticacao } from '../contexts/ContextoAutenticacao';
import { formatarErro } from '../utils/errorHandler';

export default function PaginaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  
  const { login } = useAutenticacao();

  const handleLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      await login(email, senha);
    } catch (err) {
      setErro(formatarErro(err));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
      }}
    >
      <Paper
        elevation={10}
        sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 4, textAlign: 'center' }}
      >
        <AdminIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Acesso Restrito
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Sistema de Controle RFID
        </Typography>

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="E-mail"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={carregando}
          />
          <TextField
            fullWidth
            label="Senha"
            type="password"
            variant="outlined"
            margin="normal"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            disabled={carregando}
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={carregando}
            sx={{ mt: 3, borderRadius: 2 }}
          >
            {carregando ? <CircularProgress size={24} color="inherit" /> : 'Acessar Sistema'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
