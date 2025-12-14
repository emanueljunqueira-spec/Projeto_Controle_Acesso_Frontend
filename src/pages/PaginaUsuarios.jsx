import React, { useState, useEffect, useCallback } from 'react'; // <--- Importe useCallback
import { Box, Typography, Button, Grid, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import servicoUsuario from '../services/servicoUsuario';
import { useMensagem } from '../contexts/ContextoMensagem';
import { formatarErro, podeExcluir } from '../utils/errorHandler';
import { useAutenticacao } from '../contexts/ContextoAutenticacao';

import CartaoUsuario from '../components/Cards/CartaoUsuario';
import ModalUsuario from '../components/Modais/ModalUsuario';
import ModalConfirmarExclusao from '../components/Modais/ModalConfirmarExclusao';

export default function PaginaUsuarios() {
  const { usuario } = useAutenticacao();
  const { sucesso, erro: erroMsg, aviso } = useMensagem();
  
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);

  // CORREÇÃO: Envolvemos a função em useCallback
  const buscarUsuarios = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await servicoUsuario.listar();
      setUsuarios(dados);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      erroMsg(formatarErro(err));
    } finally {
      setCarregando(false);
    }
  }, [erroMsg]); // Dependência do useCallback

  // Agora podemos adicionar buscarUsuarios aqui sem criar loop infinito
  useEffect(() => {
    buscarUsuarios();
  }, [buscarUsuarios]);

  const criarUsuario = async (novoUsuario) => {
    try {
      const criado = await servicoUsuario.criar(novoUsuario);
      setUsuarios([...usuarios, criado]);
      sucesso('Usuário criado com sucesso!');
      setModalAberto(false);
    } catch (err) {
      erroMsg(formatarErro(err));
    }
  };

  const solicitarExclusao = (usuarioAlvo) => {
    const permissao = podeExcluir(usuario, usuarioAlvo, 'usuario');
    if (!permissao.permitido) {
      aviso(permissao.mensagem);
      return;
    }
    setUsuarioParaExcluir(usuarioAlvo);
    setModalExclusaoAberto(true);
  };

  const confirmarExclusao = async (emailConfirmacao, senhaConfirmacao) => {
    try {
      await servicoUsuario.excluir(
        usuarioParaExcluir.id, 
        emailConfirmacao, 
        senhaConfirmacao
      );

      setUsuarios(usuarios.filter(u => u.id !== usuarioParaExcluir.id));
      sucesso('Usuário excluído com sucesso!');
      setModalExclusaoAberto(false);
      setUsuarioParaExcluir(null);
    } catch (err) {
      erroMsg(formatarErro(err));
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
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            Gestão de Usuários
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Administre quem tem acesso ao sistema.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalAberto(true)}
          sx={{ fontWeight: 'bold' }}
        >
          Novo Usuário
        </Button>
      </Box>

      <Grid container spacing={3}>
        {usuarios.length > 0 ? (
          usuarios.map((u) => (
            <Grid item xs={12} md={6} lg={4} key={u.id}>
              <CartaoUsuario usuario={u} aoExcluir={solicitarExclusao} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box textAlign="center" py={5}>
              <Typography color="textSecondary">
                Nenhum usuário encontrado.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

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