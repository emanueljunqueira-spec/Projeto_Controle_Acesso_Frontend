import React, { useEffect, useState, useCallback } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, 
  Chip, CircularProgress, Avatar, IconButton, Collapse 
} from '@mui/material';
import { 
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import servicoEvento from '../../services/servicoEvento';
import servicoParticipante from '../../services/servicoParticipante';
import ModalParticipante from '../Modais/ModalParticipante';
import { formatarErro } from '../../utils/errorHandler';
import { useMensagem } from '../../contexts/ContextoMensagem';
import TimelineHistoricoAcessos from '../TimelineHistoricoAcessos'; 

function LinhaParticipante({ participante }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <Box mb={2} p={2} border="1px solid #eee" borderRadius={2} bgcolor="white" boxShadow="0 2px 4px rgba(0,0,0,0.02)">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#1976d2', fontWeight: 'bold' }}>
            {participante.nome.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">{participante.nome}</Typography>
            <Typography variant="caption" color="textSecondary">{participante.email || 'Sem e-mail'}</Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Chip 
            label={participante.status_presenca?.toUpperCase() || 'SEM REGISTRO'} 
            size="small" 
            color={participante.status_presenca === 'entrada' ? 'success' : 'default'}
            variant={participante.status_presenca === 'entrada' ? 'filled' : 'outlined'}
          />
          
          <IconButton size="small" onClick={() => setExpandido(!expandido)}>
            {expandido ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expandido} timeout="auto" unmountOnExit>
        <Box mt={2} pl={1} borderTop="1px dashed #eee" pt={2}>
          <Typography variant="caption" fontWeight="bold" color="textSecondary" gutterBottom display="block">
            HISTÓRICO DE ACESSOS (TIMELINE)
          </Typography>
          <TimelineHistoricoAcessos historico_acessos={participante.historico_acessos} />
        </Box>
      </Collapse>
    </Box>
  );
}

export default function ModalParticipantesDoEvento({ aberto, evento, aoFechar }) {
  const [participantes, setParticipantes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const { sucesso, erro: erroMsg } = useMensagem();

  // CORREÇÃO: useCallback
  const carregarParticipantes = useCallback(async () => {
    if (!evento) return;
    try {
      setCarregando(true);
      const dados = await servicoEvento.listarParticipantes(evento.id);
      setParticipantes(dados.participantes || []); 
    } catch (err) {
      erroMsg(formatarErro(err));
    } finally {
      setCarregando(false);
    }
  }, [evento, erroMsg]);

  useEffect(() => {
    if (aberto && evento) {
      carregarParticipantes();
    }
  }, [aberto, evento, carregarParticipantes]);

  const salvarParticipante = async (novoParticipante) => {
    try {
      await servicoParticipante.criar({ ...novoParticipante, evento_id: evento.id });
      sucesso('Participante adicionado ao evento!');
      setModalNovoAberto(false);
      carregarParticipantes();
    } catch (err) {
      erroMsg(formatarErro(err));
    }
  };

  return (
    <Dialog open={aberto} onClose={aoFechar} fullWidth maxWidth="md">
      <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" fontWeight="bold">Participantes</Typography>
            <Typography variant="body2" color="textSecondary">
              Evento: {evento?.titulo}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<HistoryIcon />} 
            onClick={carregarParticipantes}
          >
            Atualizar Lista
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: '#f8f9fa', minHeight: 400, p: 3 }}>
        {carregando ? (
          <Box display="flex" justifyContent="center" py={5}><CircularProgress /></Box>
        ) : (
          <Box>
            {participantes.length === 0 ? (
              <Box textAlign="center" py={5} color="text.secondary">
                <Typography>Nenhum participante vinculado a este evento.</Typography>
              </Box>
            ) : (
              participantes.map(p => <LinhaParticipante key={p.id} participante={p} />)
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button onClick={() => setModalNovoAberto(true)} variant="outlined">
          Cadastrar Novo
        </Button>
        <Button onClick={aoFechar} variant="contained" color="primary">
          Fechar
        </Button>
      </DialogActions>

      <ModalParticipante
        aberto={modalNovoAberto}
        aoFechar={() => setModalNovoAberto(false)}
        aoSalvar={salvarParticipante}
      />
    </Dialog>
  );
}