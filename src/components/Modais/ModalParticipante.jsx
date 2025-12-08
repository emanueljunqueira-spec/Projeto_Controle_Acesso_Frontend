import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

export default function ModalParticipante({ aberto, aoFechar, aoSalvar }) {
  const [novoParticipante, setNovoParticipante] = useState({ nome: '', email: '' });

  const handleSalvar = () => {
    if (!novoParticipante.email || !novoParticipante.email.includes('@')) {
      return alert('O e-mail é obrigatório.');
    }
    aoSalvar({ ...novoParticipante, status: true });
    setNovoParticipante({ nome: '', email: '' });
  };

  const handleFechar = () => {
    setNovoParticipante({ nome: '', email: '' });
    aoFechar();
  };

  return (
    <Dialog open={aberto} onClose={handleFechar}>
      <DialogTitle>Novo Participante</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome"
          fullWidth
          variant="outlined"
          value={novoParticipante.nome}
          onChange={(e) => setNovoParticipante({ ...novoParticipante, nome: e.target.value })}
        />
        <TextField
          margin="dense"
          label="E-mail (Obrigatório)"
          fullWidth
          variant="outlined"
          value={novoParticipante.email}
          onChange={(e) => setNovoParticipante({ ...novoParticipante, email: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFechar}>Cancelar</Button>
        <Button onClick={handleSalvar} variant="contained" color="success">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
