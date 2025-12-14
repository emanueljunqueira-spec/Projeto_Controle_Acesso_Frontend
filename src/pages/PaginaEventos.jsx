import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMensagem } from '../contexts/ContextoMensagem';
import servicoEvento from '../services/servicoEvento';
import { formatarErro } from '../utils/errorHandler';
// Removida importação de useAutenticacao pois 'usuario' não era usado

import ListaEventos from '../components/Eventos/ListaEventos';
import FormEvento from '../components/Eventos/FormEvento';
import ModalConfirmarExclusao from '../components/Modais/ModalConfirmarExclusao';
import ModalParticipantesDoEvento from '../components/Eventos/ModalParticipantesDoEvento';

export default function PaginaEventos() {
  const { sucesso, erro: erroMsg } = useMensagem();
  
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [eventoEdicao, setEventoEdicao] = useState(null);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [eventoParaExcluir, setEventoParaExcluir] = useState(null);
  const [modalParticipantesAberto, setModalParticipantesAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  // CORREÇÃO: useCallback
  const carregarEventos = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await servicoEvento.listar();
      setEventos(dados);
    } catch (err) {
      erroMsg(formatarErro(err));
    } finally {
      setCarregando(false);
    }
  }, [erroMsg]);

  useEffect(() => {
    carregarEventos();
  }, [carregarEventos]);

  const salvarEvento = async (dadosEvento) => {
    try {
      if (eventoEdicao) {
        const atualizado = await servicoEvento.atualizar(eventoEdicao.id, dadosEvento);
        setEventos(eventos.map(e => e.id === atualizado.id ? atualizado : e));
        sucesso('Evento atualizado com sucesso!');
      } else {
        const novo = await servicoEvento.criar(dadosEvento);
        setEventos([...eventos, novo]);
        sucesso('Evento criado com sucesso!');
      }
      setModalFormAberto(false);
      setEventoEdicao(null);
    } catch (err) {
      erroMsg(formatarErro(err));
    }
  };

  const confirmarExclusao = async (emailConfirmacao, senhaConfirmacao) => {
    try {
      await servicoEvento.excluir(eventoParaExcluir.id, emailConfirmacao, senhaConfirmacao);
      setEventos(eventos.filter(e => e.id !== eventoParaExcluir.id));
      sucesso('Evento excluído com sucesso!');
      setModalExclusaoAberto(false);
      setEventoParaExcluir(null);
    } catch (err) {
      erroMsg(formatarErro(err));
    }
  };

  const aoClicarNovo = () => {
    setEventoEdicao(null);
    setModalFormAberto(true);
  };

  const aoClicarEditar = (evento) => {
    setEventoEdicao(evento);
    setModalFormAberto(true);
  };

  const aoClicarExcluir = (evento) => {
    setEventoParaExcluir(evento);
    setModalExclusaoAberto(true);
  };

  const aoClicarVerParticipantes = (evento) => {
    setEventoSelecionado(evento);
    setModalParticipantesAberto(true);
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
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          Gestão de Eventos
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={aoClicarNovo}
          sx={{ fontWeight: 'bold' }}
        >
          Novo Evento
        </Button>
      </Box>

      <ListaEventos 
        eventos={eventos} 
        onEditar={aoClicarEditar} 
        onExcluir={aoClicarExcluir} 
        onVerParticipantes={aoClicarVerParticipantes} 
      />

      {eventos.length === 0 && (
        <Typography color="textSecondary" textAlign="center" mt={4}>
          Nenhum evento cadastrado.
        </Typography>
      )}

      <FormEvento 
        aberto={modalFormAberto} 
        aoFechar={() => { setModalFormAberto(false); setEventoEdicao(null); }} 
        aoSalvar={salvarEvento} 
        eventoInicial={eventoEdicao} 
      />

      <ModalConfirmarExclusao
        aberto={modalExclusaoAberto}
        aoFechar={() => { setModalExclusaoAberto(false); setEventoParaExcluir(null); }}
        nomeItem={eventoParaExcluir?.titulo}
        aoConfirmar={confirmarExclusao}
      />

      <ModalParticipantesDoEvento
        aberto={modalParticipantesAberto}
        evento={eventoSelecionado}
        aoFechar={() => { setModalParticipantesAberto(false); setEventoSelecionado(null); }}
      />
    </Box>
  );
}