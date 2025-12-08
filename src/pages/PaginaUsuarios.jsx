import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Alert, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import servicoUsuario from '../services/servicoUsuario';
import { formatarErro, podeExcluir } from '../utils/errorHandler';
import { useAutenticacao } from '../contexts/ContextoAutenticacao';
import CartaoUsuario from '../components/Cards/CartaoUsuario';
import ModalUsuario from '../components/Modais/ModalUsuario';
import ModalConfirmarExclusao from '../components/Modais/ModalConfirmarExclusao';

export default function PaginaUsuarios() {
  const { usuario, ehAdmin } = useAutenticacao();
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);

  const buscarUsuarios = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await servicoUsuario.listar();
      setUsuarios(dados);
    } catch (err) {
      setErro(formatarErro(err));
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const criarUsuario = async (novoUsuario) => {
    try {
      await servicoUsuario.criar(novoUsuario);
      alert('Usuário criado com sucesso!');
      setModalAberto(false);
      buscarUsuarios();
    } catch (err) {
      alert('Erro: ' + formatarErro(err));
    }
  };

  const solicitarExclusao = (usuarioAlvo) => {
    const validacao = podeExcluir(usuario, usuarioAlvo, 'usuario');
    
    if (!validacao.permitido) {
      return alert(validacao.mensagem);
    }

    setUsuarioParaExcluir(usuarioAlvo);
    setModalExclusaoAberto(true);
  };

  const confirmarExclusao = async (email, senha) => {
    try {
      // CORREÇÃO: Passa 'id', 'email' e 'senha' para o serviço
      await servicoUsuario.excluir(usuarioParaExcluir.id, email, senha);
      
      alert('Usuário excluído com sucesso!');
      setModalExclusaoAberto(false);
      setUsuarioParaExcluir(null);
      buscarUsuarios();
    } catch (err) {
      alert('Falha ao excluir: ' + formatarErro(err));
    }
  };

  if (carregando) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Gestão de Usuários
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalAberto(true)}
        >
          Novo Usuário
        </Button>
      </Box>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      <Grid container spacing={2}>
        {usuarios.map((u) => (
          <Grid item xs={12} md={6} lg={4} key={u.id}>
            <CartaoUsuario usuario={u} aoExcluir={solicitarExclusao} />
          </Grid>
        ))}
      </Grid>

      {usuarios.length === 0 && !erro && (
        <Typography color="textSecondary" textAlign="center" mt={4}>
          Nenhum usuário cadastrado.
        </Typography>
      )}

      <ModalUsuario
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        aoSalvar={criarUsuario}
      />

      <ModalConfirmarExclusao
        aberto={modalExclusaoAberto}
        aoFechar={() => {
          setModalExclusaoAberto(false);
          setUsuarioParaExcluir(null);
        }}
        nomeItem={usuarioParaExcluir?.nome}
        aoConfirmar={confirmarExclusao}
      />
    </Box>
  );
}
