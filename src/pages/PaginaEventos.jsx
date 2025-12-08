import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import servicoEvento from '../services/servicoEvento';
import { formatarErro, podeExcluir } from '../utils/errorHandler';
import { useAutenticacao } from '../contexts/ContextoAutenticacao';
import ListaEventos from '../components/Eventos/ListaEventos';
import FormEvento from '../components/Eventos/FormEvento';
import ModalConfirmarExclusao from '../components/Modais/ModalConfirmarExclusao';
import ModalParticipante from '../components/Modais/ModalParticipante';
import servicoParticipante from '../services/servicoParticipante';
import ModalParticipantesDoEvento from '../components/Eventos/ModalParticipantesDoEvento';

export default function PaginaEventos() {
  const { usuario } = useAutenticacao();
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoEdicao, setEventoEdicao] = useState(null);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [eventoParaExcluir, setEventoParaExcluir] = useState(null);
  const [modalCadastrarParticipanteAberto, setModalCadastrarParticipanteAberto] = useState(false);
  const [eventoParaCadastro, setEventoParaCadastro] = useState(null);
  const [modalListaParticipantesAberto, setModalListaParticipantesAberto] = useState(false);
  const [eventoParaLista, setEventoParaLista] = useState(null);

  const carregar = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await servicoEvento.listar();
      setEventos(dados);
    } catch (err) {
      setErro(formatarErro(err));
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const novoEvento = () => { setEventoEdicao(null); setModalAberto(true); };
  const editarEvento = (ev) => { setEventoEdicao(ev); setModalAberto(true); };

  const salvarEvento = async (payload) => {
    try {
      if (eventoEdicao) {
        await servicoEvento.atualizar(eventoEdicao.id, payload);
      } else {
        await servicoEvento.criar(payload);
      }
      setModalAberto(false);
      setEventoEdicao(null);
      await carregar();
      alert('Evento salvo com sucesso!');
    } catch (err) {
      alert('Erro: ' + formatarErro(err));
    }
  };

  const solicitarExclusao = (ev) => {
    const validacao = podeExcluir(usuario, { cargo: 'participante' }, 'usuario'); // reaproveita regra apenas para bloquear não-admin
    if (!validacao.permitido) {
      return alert(validacao.mensagem);
    }
    setEventoParaExcluir(ev);
    setModalExclusaoAberto(true);
  };

  const confirmarExclusao = async (email, senha) => {
    try {
      // Passa o ID, o Email e a Senha para o serviço
      await servicoEvento.excluir(eventoParaExcluir.id, email, senha);
      
      alert('Evento excluído com sucesso!'); // Feedback simples ou use um Alert no estado
      setModalExclusaoAberto(false);
      setEventoParaExcluir(null);
      // Recarrega a lista
      const listaAtualizada = await servicoEvento.listar();
      setEventos(listaAtualizada);
    } catch (err) {
      alert('Falha ao excluir: ' + formatarErro(err));
    }
  };

  const abrirListaParticipantes = (ev) => {
    setEventoParaLista(ev);
    setModalListaParticipantesAberto(true);
  };

  const salvarParticipante = async (novo) => {
    try {
      const payload = eventoParaCadastro ? { ...novo, evento_id: eventoParaCadastro.id } : novo;
      await servicoParticipante.criar(payload);
      setModalCadastrarParticipanteAberto(false);
      setEventoParaCadastro(null);
      alert('Participante cadastrado com sucesso!');
    } catch (err) {
      alert('Erro: ' + formatarErro(err));
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
        <Typography variant="h5" fontWeight="bold">Eventos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={novoEvento}>Novo Evento</Button>
      </Box>

      {erro && (<Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>)}

      <ListaEventos eventos={eventos} onEditar={editarEvento} onExcluir={solicitarExclusao} onCadastrarParticipante={abrirListaParticipantes} />

      {eventos.length === 0 && !erro && (
        <Typography color="textSecondary" textAlign="center" mt={4}>Nenhum evento cadastrado.</Typography>
      )}

      <FormEvento aberto={modalAberto} aoFechar={() => setModalAberto(false)} aoSalvar={salvarEvento} eventoInicial={eventoEdicao} />

      <ModalConfirmarExclusao
        aberto={modalExclusaoAberto}
        aoFechar={() => { setModalExclusaoAberto(false); setEventoParaExcluir(null); }}
        nomeItem={eventoParaExcluir?.titulo}
        aoConfirmar={confirmarExclusao}
      />

      <ModalParticipante
        aberto={modalCadastrarParticipanteAberto}
        aoFechar={() => { setModalCadastrarParticipanteAberto(false); setEventoParaCadastro(null); }}
        aoSalvar={salvarParticipante}
      />

      <ModalParticipantesDoEvento
        aberto={modalListaParticipantesAberto}
        evento={eventoParaLista}
        aoFechar={() => { setModalListaParticipantesAberto(false); setEventoParaLista(null); }}
      />
    </Box>
  );
}
