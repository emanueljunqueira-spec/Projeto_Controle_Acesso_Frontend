import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { Box, Typography, Button, Grid, Alert, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import servicoParticipante from '../services/servicoParticipante';
import { formatarErro, podeExcluir } from '../utils/errorHandler';
import { useAutenticacao } from '../contexts/ContextoAutenticacao';
import CartaoParticipante from '../components/Cards/CartaoParticipante';
import ModalParticipante from '../components/Modais/ModalParticipante';
import ModalConfirmarExclusao from '../components/Modais/ModalConfirmarExclusao';
import MonitorAcessos from '../components/MonitorAcessos';

export default function PaginaParticipantes() {
  const { usuario } = useAutenticacao();
  const [participantes, setParticipantes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [participanteParaExcluir, setParticipanteParaExcluir] = useState(null);

  const buscarParticipantes = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await servicoParticipante.listar();
      setParticipantes(dados);
    } catch (err) {
      setErro(formatarErro(err));
    } finally {
      setCarregando(false);
    }
  };

  // 1. Busca inicial
  useEffect(() => {
    buscarParticipantes();
  }, []);

  // 2. MQTT (Real-time)
  useEffect(() => {
    const client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt');

    client.on('connect', () => {
      console.log('✅ Frontend conectado ao MQTT');
      client.subscribe('sistema-rfid/monitor');
    });

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        console.log('📩 Mensagem recebida:', payload);

        if (payload.participanteId) {
          setParticipantes((listaAtual) => 
            listaAtual.map((p) => {
              // Convertendo para String para garantir que números e textos batam
              if (String(p.id) === String(payload.participanteId)) {
                console.log(`🔄 Atualizando card de: ${p.nome}`);
                return { ...p, status: payload.tipo === 'entrada' };
              }
              return p;
            })
          );
        }
      } catch (err) {
        console.error('Erro MQTT:', err);
      }
    });

    return () => {
      if (client) client.end();
    };
  }, []);

  const criarParticipante = async (novoParticipante) => {
    try {
      await servicoParticipante.criar(novoParticipante);
      alert('Participante criado com sucesso!');
      setModalAberto(false);
      buscarParticipantes();
    } catch (err) {
      alert('Erro: ' + formatarErro(err));
    }
  };

  const solicitarExclusao = (participanteAlvo) => {
    const validacao = podeExcluir(usuario, participanteAlvo, 'participante');
    if (!validacao.permitido) return alert(validacao.mensagem);
    setParticipanteParaExcluir(participanteAlvo);
    setModalExclusaoAberto(true);
  };

  const confirmarExclusao = async (email, senha) => {
    try {
      await servicoParticipante.excluir(participanteParaExcluir.id, email, senha);
      alert('Participante excluído com sucesso!');
      setModalExclusaoAberto(false);
      setParticipanteParaExcluir(null);
      buscarParticipantes();
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
        <Typography variant="h5" fontWeight="bold">Participantes RFID</Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => setModalAberto(true)}>
          Novo Participante
        </Button>
      </Box>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {participantes.map((p) => (
              <Grid item xs={12} lg={6} key={p.id}>
                <CartaoParticipante participante={p} aoExcluir={solicitarExclusao} />
              </Grid>
            ))}
             {participantes.length === 0 && !erro && (
              <Grid item xs={12}>
                 <Typography color="textSecondary" textAlign="center" mt={4}>Nenhum participante cadastrado.</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <MonitorAcessos />
          </Box>
        </Grid>
      </Grid>

      <ModalParticipante aberto={modalAberto} aoFechar={() => setModalAberto(false)} aoSalvar={criarParticipante} />
      <ModalConfirmarExclusao aberto={modalExclusaoAberto} aoFechar={() => { setModalExclusaoAberto(false); setParticipanteParaExcluir(null); }} nomeItem={participanteParaExcluir?.nome} aoConfirmar={confirmarExclusao} />
    </Box>
  );
}