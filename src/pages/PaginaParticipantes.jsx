import React, { useState, useEffect, useCallback } from 'react'; // Importe useCallback
import { Box, Typography, Button, Grid, CircularProgress, Card } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import servicoParticipante from '../services/servicoParticipante';
import { formatarErro } from '../utils/errorHandler';
import { useMensagem } from '../contexts/ContextoMensagem';

import CartaoParticipante from '../components/Cards/CartaoParticipante';
import ModalParticipante from '../components/Modais/ModalParticipante';
import ModalConfirmarExclusao from '../components/Modais/ModalConfirmarExclusao';
import MonitorAcessos from '../components/MonitorAcessos';

export default function PaginaParticipantes() {
  const { sucesso, erro: erroMsg } = useMensagem();
  
  const [participantes, setParticipantes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [participanteParaExcluir, setParticipanteParaExcluir] = useState(null);

  // CORREÇÃO: useCallback para estabilizar a função
  const buscarParticipantes = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await servicoParticipante.listar();
      setParticipantes(dados);
    } catch (err) {
      erroMsg(formatarErro(err));
    } finally {
      setCarregando(false);
    }
  }, [erroMsg]);

  useEffect(() => {
    buscarParticipantes();
  }, [buscarParticipantes]);

  const criarParticipante = async (novoParticipante) => {
    try {
      const criado = await servicoParticipante.criar(novoParticipante);
      setParticipantes([...participantes, criado]);
      sucesso('Participante cadastrado com sucesso!');
      setModalAberto(false);
    } catch (err) {
      erroMsg(formatarErro(err));
    }
  };

  const solicitarExclusao = (participante) => {
    setParticipanteParaExcluir(participante);
    setModalExclusaoAberto(true);
  };

  const confirmarExclusao = async (emailConfirmacao, senhaConfirmacao) => {
    try {
      await servicoParticipante.excluir(participanteParaExcluir.id, emailConfirmacao, senhaConfirmacao);
      setParticipantes(participantes.filter(p => p.id !== participanteParaExcluir.id));
      sucesso('Participante excluído com sucesso!');
      setModalExclusaoAberto(false);
      setParticipanteParaExcluir(null);
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
            Participantes RFID
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Gerencie quem tem acesso e monitore entradas em tempo real.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="success" 
          startIcon={<AddIcon />} 
          onClick={() => setModalAberto(true)}
          sx={{ fontWeight: 'bold' }}
        >
          Novo Participante
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {participantes.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#fff', borderRadius: 2 }}>
              <Typography color="textSecondary">
                Nenhum participante cadastrado.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {participantes.map((p) => (
                <Grid item xs={12} lg={6} key={p.id}>
                  <CartaoParticipante 
                    participante={p} 
                    aoExcluir={solicitarExclusao} 
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ position: { md: 'sticky' }, top: 100 }}>
            <MonitorAcessos />
          </Box>
        </Grid>
      </Grid>

      <ModalParticipante 
        aberto={modalAberto} 
        aoFechar={() => setModalAberto(false)} 
        aoSalvar={criarParticipante} 
      />
      
      <ModalConfirmarExclusao 
        aberto={modalExclusaoAberto} 
        aoFechar={() => { setModalExclusaoAberto(false); setParticipanteParaExcluir(null); }}
        nomeItem={participanteParaExcluir?.nome}
        aoConfirmar={confirmarExclusao}
      />
    </Box>
  );
}