import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

export default function ModalUsuario({ aberto, aoFechar, aoSalvar }) {
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    cargo: 'operador'
  });

  const handleSalvar = () => {
    aoSalvar(novoUsuario);
    setNovoUsuario({ nome: '', email: '', senha: '', cargo: 'operador' });
  };

  const handleFechar = () => {
    setNovoUsuario({ nome: '', email: '', senha: '', cargo: 'operador' });
    aoFechar();
  };

  return (
    <Dialog open={aberto} onClose={handleFechar}>
      <DialogTitle>Novo Usuário</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome"
          fullWidth
          variant="outlined"
          value={novoUsuario.nome}
          onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
        />
        <TextField
          margin="dense"
          label="E-mail"
          fullWidth
          variant="outlined"
          value={novoUsuario.email}
          onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Senha"
          type="password"
          fullWidth
          variant="outlined"
          value={novoUsuario.senha}
          onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Cargo</InputLabel>
          <Select
            value={novoUsuario.cargo}
            label="Cargo"
            onChange={(e) => setNovoUsuario({ ...novoUsuario, cargo: e.target.value })}
          >
            <MenuItem value="operador">Operador</MenuItem>
            <MenuItem value="gerente">Gerente</MenuItem>
            <MenuItem value="administrador">Administrador</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFechar}>Cancelar</Button>
        <Button onClick={handleSalvar} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
