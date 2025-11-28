import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  CssBaseline,
  Button, // Usamos Button em vez de IconButton para ser mais visível
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Paper,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';

import { 
  People as PeopleIcon, 
  AdminPanelSettings as AdminIcon, 
  Logout as LogoutIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

import './App.css'; // Se tiver estilos globais

const drawerWidth = 240;

// Configuração da API
const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Estados de Login
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados de Dados
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaParticipantes, setListaParticipantes] = useState([]);
  const [view, setView] = useState('usuarios');

  // Modais de Cadastro
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openPartModal, setOpenPartModal] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '', cargo: 'operador' });
  const [novoParticipante, setNovoParticipante] = useState({ nome: '', email: '' });

  // Estados de Exclusão
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); 
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');

  // --- INICIALIZAÇÃO ---
  useEffect(() => {
    const storedToken = localStorage.getItem('rfid_token');
    const storedUser = localStorage.getItem('rfid_user');

    if (storedToken && storedUser) {
      const u = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(u);
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
      buscarUsuarios(); // Já carrega a lista ao abrir
    }
  }, []);

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/sessoes', { email, senha });
      const { token, usuario } = response.data;

      localStorage.setItem('rfid_token', token);
      localStorage.setItem('rfid_user', JSON.stringify(usuario));

      setToken(token);
      setUser(usuario);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      buscarUsuarios();
    } catch (err) {
      alert('Login falhou: ' + (err.response?.data?.error || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setEmail('');
    setSenha('');
  };

  // --- BUSCAR DADOS ---
  const buscarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setListaUsuarios(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const buscarParticipantes = async () => {
    try {
      const response = await api.get('/participantes');
      setListaParticipantes(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMenuClick = (targetView) => {
    setView(targetView);
    if (targetView === 'usuarios') buscarUsuarios();
    if (targetView === 'participantes') buscarParticipantes();
  };

  // --- CADASTRO ---
  const criarUsuario = async () => {
    try {
      await api.post('/usuarios', novoUsuario);
      alert('Usuário criado com sucesso!');
      setOpenUserModal(false);
      setNovoUsuario({ nome: '', email: '', senha: '', cargo: 'operador' });
      buscarUsuarios();
    } catch (err) {
      alert('Erro: ' + formatarErro(err));
    }
  };

  const criarParticipante = async () => {
    if (!novoParticipante.email || !novoParticipante.email.includes('@')) {
      return alert('O e-mail é obrigatório.');
    }
    try {
      await api.post('/participantes', { ...novoParticipante, status: true });
      alert('Participante criado com sucesso!');
      setOpenPartModal(false);
      setNovoParticipante({ nome: '', email: '' });
      buscarParticipantes();
    } catch (err) {
      alert('Erro: ' + formatarErro(err));
    }
  };

  // --- EXCLUSÃO ---
  const solicitarExclusao = (item, tipo) => {
    // Validação no frontend antes de abrir o modal
    if (user.cargo !== 'administrador') {
      return alert(`Ação bloqueada! Seu cargo atual é '${user.cargo}'. Apenas 'administrador' pode excluir.`);
    }

    if (tipo === 'usuario' && item.cargo === 'administrador') {
      return alert('Segurança: Você não pode excluir outro Administrador.');
    }

    setDeleteTarget({ id: item.id, tipo, nome: item.nome });
    setSenhaConfirmacao('');
    setOpenDeleteDialog(true);
  };

  const confirmarExclusao = async () => {
    if (!senhaConfirmacao) return alert('Por favor, digite sua senha.');

    try {
      const endpoint = deleteTarget.tipo === 'usuario' ? '/usuarios' : '/participantes';
      
      // Envia a senha no corpo da requisição DELETE
      await api.delete(`${endpoint}/${deleteTarget.id}`, {
        data: { senhaConfirmacao: senhaConfirmacao }
      });

      alert('Item excluído com sucesso!');
      setOpenDeleteDialog(false);
      
      // Atualiza a lista correta
      if (deleteTarget.tipo === 'usuario') buscarUsuarios();
      else buscarParticipantes();

    } catch (err) {
      alert('Falha ao excluir: ' + (err.response?.data?.error || err.message));
    }
  };

  const formatarErro = (err) => {
    if (err.response?.data?.error) return err.response.data.error;
    if (err.response?.data?.errors) {
      const erros = err.response.data.errors;
      return Object.values(erros).map(e => e[0]).join('\n');
    }
    return err.message;
  };

  // =========================================================
  // RENDERIZAÇÃO
  // =========================================================

  // Tela de Login
  if (!user) {
    return (
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' 
      }}>
        <Paper elevation={10} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 4, textAlign: 'center' }}>
          <AdminIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>Acesso Restrito</Typography>
          
          <form onSubmit={handleLogin}>
            <TextField 
              fullWidth label="E-mail" variant="outlined" margin="normal" 
              value={email} onChange={e => setEmail(e.target.value)} required 
            />
            <TextField 
              fullWidth label="Senha" type="password" variant="outlined" margin="normal" 
              value={senha} onChange={e => setSenha(e.target.value)} required 
            />
            <Button 
              fullWidth variant="contained" size="large" type="submit" 
              disabled={loading} sx={{ mt: 3, borderRadius: 2 }}
            >
              {loading ? 'Entrando...' : 'Acessar Sistema'}
            </Button>
          </form>
        </Paper>
      </Box>
    );
  }

  // Tela Dashboard (Logado)
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Barra Superior */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            RFID Manager
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Olá, <strong>{user.nome}</strong>
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      {/* Menu Lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton selected={view === 'usuarios'} onClick={() => handleMenuClick('usuarios')}>
                <ListItemIcon><AdminIcon /></ListItemIcon>
                <ListItemText primary="Usuários" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton selected={view === 'participantes'} onClick={() => handleMenuClick('participantes')}>
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                <ListItemText primary="Participantes" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>

      {/* Conteúdo Principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Toolbar /> 
        
        {/* ABA USUÁRIOS */}
        {view === 'usuarios' && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight="bold">Gestão de Usuários</Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenUserModal(true)}>
                Novo Usuário
              </Button>
            </Box>

            <Grid container spacing={2}>
              {listaUsuarios.map((u) => (
                <Grid item xs={12} md={6} lg={4} key={u.id}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    
                    {/* Dados do Usuário */}
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box sx={{ bgcolor: '#e3f2fd', p: 1, borderRadius: '50%' }}>
                        <AdminIcon color="primary" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">{u.nome}</Typography>
                        <Typography variant="body2" color="textSecondary">{u.email}</Typography>
                        <Chip label={u.cargo} size="small" sx={{ mt: 0.5 }} />
                      </Box>
                    </Box>

                    {/* BOTÃO EXCLUIR (Visível para todos) */}
                    <Button 
                      variant="outlined" 
                      color="error" 
                      fullWidth
                      startIcon={<DeleteIcon />}
                      onClick={() => solicitarExclusao(u, 'usuario')}
                    >
                      EXCLUIR USUÁRIO
                    </Button>

                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* ABA PARTICIPANTES */}
        {view === 'participantes' && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight="bold">Participantes RFID</Typography>
              <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => setOpenPartModal(true)}>
                Novo Participante
              </Button>
            </Box>

            <Grid container spacing={2}>
              {listaParticipantes.map((p) => (
                <Grid item xs={12} md={6} lg={4} key={p.id}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    
                    {/* Dados do Participante */}
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box sx={{ bgcolor: '#e8f5e9', p: 1, borderRadius: '50%' }}>
                        <PeopleIcon color="success" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">{p.nome}</Typography>
                        <Typography variant="body2" color="textSecondary">{p.email || 'Sem e-mail'}</Typography>
                        <Chip 
                          label={p.status ? 'ATIVO' : 'INATIVO'} 
                          size="small" 
                          color={p.status ? 'success' : 'error'} 
                          sx={{ mt: 0.5 }} 
                        />
                      </Box>
                    </Box>

                    {/* BOTÃO EXCLUIR (Visível para todos) */}
                    <Button 
                      variant="outlined" 
                      color="error" 
                      fullWidth
                      startIcon={<DeleteIcon />}
                      onClick={() => solicitarExclusao(p, 'participante')}
                    >
                      EXCLUIR PARTICIPANTE
                    </Button>

                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      {/* --- MODAIS --- */}

      {/* Modal Criar Usuário */}
      <Dialog open={openUserModal} onClose={() => setOpenUserModal(false)}>
        <DialogTitle>Novo Usuário</DialogTitle>
        <DialogContent>
          <TextField 
            autoFocus margin="dense" label="Nome" fullWidth variant="outlined" 
            value={novoUsuario.nome} onChange={e => setNovoUsuario({...novoUsuario, nome: e.target.value})} 
          />
          <TextField 
            margin="dense" label="E-mail" fullWidth variant="outlined" 
            value={novoUsuario.email} onChange={e => setNovoUsuario({...novoUsuario, email: e.target.value})} 
          />
          <TextField 
            margin="dense" label="Senha" type="password" fullWidth variant="outlined" 
            value={novoUsuario.senha} onChange={e => setNovoUsuario({...novoUsuario, senha: e.target.value})} 
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Cargo</InputLabel>
            <Select 
              value={novoUsuario.cargo} label="Cargo"
              onChange={e => setNovoUsuario({...novoUsuario, cargo: e.target.value})}
            >
              <MenuItem value="operador">Operador</MenuItem>
              <MenuItem value="gerente">Gerente</MenuItem>
              <MenuItem value="administrador">Administrador</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserModal(false)}>Cancelar</Button>
          <Button onClick={criarUsuario} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Criar Participante */}
      <Dialog open={openPartModal} onClose={() => setOpenPartModal(false)}>
        <DialogTitle>Novo Participante</DialogTitle>
        <DialogContent>
          <TextField 
            autoFocus margin="dense" label="Nome" fullWidth variant="outlined" 
            value={novoParticipante.nome} onChange={e => setNovoParticipante({...novoParticipante, nome: e.target.value})} 
          />
          <TextField 
            margin="dense" label="E-mail (Obrigatório)" fullWidth variant="outlined" 
            value={novoParticipante.email} onChange={e => setNovoParticipante({...novoParticipante, email: e.target.value})} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPartModal(false)}>Cancelar</Button>
          <Button onClick={criarParticipante} variant="contained" color="success">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Confirmar Exclusão */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você está prestes a excluir <strong>{deleteTarget?.nome}</strong>. 
            Esta ação não pode ser desfeita.
            <br /><br />
            Por segurança, digite sua senha de administrador para confirmar:
          </DialogContentText>
          <TextField 
            autoFocus margin="dense" label="Sua Senha" type="password" fullWidth variant="outlined"
            value={senhaConfirmacao} onChange={e => setSenhaConfirmacao(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmarExclusao} variant="contained" color="error">
            Confirmar Exclusão
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}