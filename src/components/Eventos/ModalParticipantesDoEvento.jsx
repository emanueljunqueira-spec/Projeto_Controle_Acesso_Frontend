import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Chip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Login as EntradaIcon, Logout as SaidaIcon, Block as NegadoIcon, HelpOutline as SemRegistroIcon } from '@mui/icons-material';
import servicoEvento from '../../services/servicoEvento';
import servicoParticipante from '../../services/servicoParticipante';
import ModalParticipante from '../Modais/ModalParticipante';
import { formatarErro } from '../../utils/errorHandler';

function formatarDataHora(iso){
  try { return new Date(iso).toLocaleString('pt-BR'); } catch { return iso; }
}

// Mapeamento de status de presença para exibição
const statusPresencaConfig = {
  entrada: { label: 'Presente', color: 'success', icon: <EntradaIcon fontSize="small" /> },
  saida: { label: 'Ausente', color: 'warning', icon: <SaidaIcon fontSize="small" /> },
  negado: { label: 'Negado', color: 'error', icon: <NegadoIcon fontSize="small" /> },
  sem_registro: { label: 'Sem Registro', color: 'default', icon: <SemRegistroIcon fontSize="small" /> },
};

export default function ModalParticipantesDoEvento({ aberto, evento, aoFechar }) {
  const [participantes, setParticipantes] = useState([]);
  const [dadosEvento, setDadosEvento] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [modalNovoAberto, setModalNovoAberto] = useState(false);

  const carregar = async () => {
    if (!evento) return;
    try {
      setCarregando(true);
      setErro(null);
      const resposta = await servicoEvento.listarParticipantes(evento.id);
      setDadosEvento(resposta.evento);
      setParticipantes(resposta.participantes || []);
    } catch (err) {
      setErro(formatarErro(err));
    } finally {
      setCarregando(false);
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

  const getStatusConfig = (status) => {
    return statusPresencaConfig[status] || statusPresencaConfig.sem_registro;
  };

  return (
    <Dialog open={aberto} onClose={aoFechar} fullWidth maxWidth="lg">
      <DialogTitle>
        <Box>
          <Typography variant="h6">Participantes do Evento</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {evento?.titulo} - {evento?.local}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {carregando && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}
        
        {erro && <Typography color="error" mb={2}>{erro}</Typography>}
        
        {!carregando && participantes.length === 0 && !erro && (
          <Typography color="textSecondary" textAlign="center" py={4}>
            Nenhum participante vinculado a este evento.
          </Typography>
        )}
        
        {!carregando && participantes.length > 0 && (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Nome</strong></TableCell>
                  <TableCell><strong>E-mail</strong></TableCell>
                  <TableCell><strong>Status Cadastro</strong></TableCell>
                  <TableCell><strong>Presença</strong></TableCell>
                  <TableCell><strong>Último Registro</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participantes.map((p) => {
                  const statusConfig = getStatusConfig(p.status_presenca);
                  return (
                    <TableRow key={p.id} hover>
                      <TableCell>{p.nome}</TableCell>
                      <TableCell>{p.email || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={p.status_cadastro ? 'Ativo' : 'Inativo'} 
                          size="small" 
                          color={p.status_cadastro ? 'success' : 'error'} 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={statusConfig.icon}
                          label={statusConfig.label} 
                          size="small" 
                          color={statusConfig.color} 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {p.ultimo_registro ? (
                          <Box>
                            <Typography variant="body2">
                              {p.ultimo_registro.tipo === 'entrada' ? 'Entrada' : 
                               p.ultimo_registro.tipo === 'saida' ? 'Saída' : 'Negado'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatarDataHora(p.ultimo_registro.data_hora)}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">-</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {!carregando && participantes.length > 0 && (
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Typography variant="body2" color="textSecondary">
              Total: {participantes.length} participante(s)
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalNovoAberto(true)} variant="contained" color="primary">
          Cadastrar Participante
        </Button>
        <Button onClick={aoFechar} variant="outlined">Fechar</Button>
      </DialogActions>

      <ModalParticipante
        aberto={modalNovoAberto}
        aoFechar={() => setModalNovoAberto(false)}
        aoSalvar={salvarParticipante}
      />
    </Dialog>
  );
}
