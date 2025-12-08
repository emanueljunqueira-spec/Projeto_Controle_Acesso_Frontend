import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Chip } from '@mui/material';
import servicoParticipante from '../../services/servicoParticipante';
import ModalParticipante from '../Modais/ModalParticipante';
import { formatarErro } from '../../utils/errorHandler';

function formatarDataHora(iso){
  try { return new Date(iso).toLocaleString('pt-BR'); } catch { return iso; }
}

export default function ModalParticipantesDoEvento({ aberto, evento, aoFechar }) {
  const [participantes, setParticipantes] = useState([]);
  const [erro, setErro] = useState(null);
  const [modalNovoAberto, setModalNovoAberto] = useState(false);

  const carregar = async () => {
    if (!evento) return;
    try {
      setErro(null);
      const lista = await servicoParticipante.listarPorEvento(evento.id);
      setParticipantes(lista);
    } catch (err) {
      setErro(formatarErro(err));
    }
  };

  useEffect(() => { if (aberto) carregar(); }, [aberto, evento]);

  const salvarParticipante = async (novo) => {
    try {
      await servicoParticipante.criar({ ...novo, evento_id: evento.id });
      setModalNovoAberto(false);
      await carregar();
      alert('Participante cadastrado no evento!');
    } catch (err) {
      alert('Erro: ' + formatarErro(err));
    }
  };

  return (
    <Dialog open={aberto} onClose={aoFechar} fullWidth maxWidth="md">
      <DialogTitle>Participantes do evento: {evento?.titulo}</DialogTitle>
      <DialogContent>
        {erro && <Typography color="error" mb={2}>{erro}</Typography>}
        {participantes.length === 0 && !erro && (
          <Typography color="textSecondary">Nenhum participante vinculado a este evento.</Typography>
        )}
        {participantes.map((p) => (
          <Box key={p.id} sx={{ p:1, mb:1, border:'1px solid #eee', borderRadius:1 }}>
            <Typography variant="subtitle2" fontWeight="bold">{p.nome}</Typography>
            <Typography variant="body2">{p.email || 'Sem e-mail'}</Typography>
            <Box display="flex" gap={1} alignItems="center" mt={0.5}>
              <Chip label={p.status ? 'ATIVO' : 'INATIVO'} size="small" color={p.status ? 'success' : 'error'} />
              {p.ultimo_acesso && (
                <Typography variant="caption" color="textSecondary">
                  Último acesso: {p.ultimo_acesso.tipo_movimento} em {formatarDataHora(p.ultimo_acesso.hora_evento)}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalNovoAberto(true)} variant="contained">Cadastrar Participante</Button>
        <Button onClick={aoFechar}>Fechar</Button>
      </DialogActions>

      <ModalParticipante
        aberto={modalNovoAberto}
        aoFechar={() => setModalNovoAberto(false)}
        aoSalvar={salvarParticipante}
      />
    </Dialog>
  );
}
