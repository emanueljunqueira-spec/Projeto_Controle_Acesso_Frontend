import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importante para navegação
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import { useAutenticacao } from '../contexts/ContextoAutenticacao';
import { formatarErro } from '../utils/errorHandler';

export default function PaginaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregandoLocal, setCarregandoLocal] = useState(false);
  const [erro, setErro] = useState(null);
  
  const { login, estaAutenticado } = useAutenticacao();
  const navigate = useNavigate(); // Hook de navegação

  // Se já estiver logado, redireciona imediatamente
  useEffect(() => {
    if (estaAutenticado) {
      navigate('/dashboard/usuarios');
    }
  }, [estaAutenticado, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setCarregandoLocal(true);
    setErro(null);

    try {
      await login(email, senha);
      navigate('/dashboard/usuarios'); // Redireciona após sucesso
    } catch (err) {
      setErro(formatarErro(err));
    } finally {
      setCarregandoLocal(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
      <Paper elevation={10} sx={{ p: 4, width: '100%', maxWidth: 400, textAlign: 'center', borderRadius: 4 }}>
        <AdminIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>Acesso Restrito</Typography>
        
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

        <form onSubmit={handleLogin}>
          <TextField fullWidth label="E-mail" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField fullWidth label="Senha" type="password" margin="normal" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          
          <Button fullWidth variant="contained" size="large" type="submit" disabled={carregandoLocal} sx={{ mt: 3 }}>
            {carregandoLocal ? <CircularProgress size={24} color="inherit" /> : 'ENTRAR'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}