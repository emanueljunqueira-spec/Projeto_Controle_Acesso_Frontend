import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

export default function ModalConfirmarExclusao({ aberto, aoFechar, nomeItem, aoConfirmar }) {
  const [emailConfirmacao, setEmailConfirmacao] = useState('');
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');

  const handleConfirmar = () => {
    if (!emailConfirmacao || !senhaConfirmacao) {
      return alert('Por favor, digite seu e-mail e senha para confirmar.');
    }
    // Agora enviamos os dois dados
    aoConfirmar(emailConfirmacao, senhaConfirmacao);
    limparCampos();
  };

  const handleFechar = () => {
    limparCampos();
    aoFechar();
  };

  const limparCampos = () => {
    setEmailConfirmacao('');
    setSenhaConfirmacao('');
  };

  return (
    <Dialog open={aberto} onClose={handleFechar}>
      <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
        ⚠️ Zona de Perigo: Exclusão
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Você está prestes a excluir <strong>{nomeItem}</strong>.
          <br />
          Esta ação é irreversível e removerá todos os dados vinculados.
        </DialogContentText>
        
        <DialogContentText sx={{ mb: 2, fontWeight: 'bold' }}>
          Para sua segurança, confirme suas credenciais de Administrador:
        </DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          label="Seu E-mail de Administrador"
          type="email"
          fullWidth
          variant="outlined"
          value={emailConfirmacao}
          onChange={(e) => setEmailConfirmacao(e.target.value)}
        />
        
        <TextField
          margin="dense"
          label="Sua Senha"
          type="password"
          fullWidth
          variant="outlined"
          value={senhaConfirmacao}
          onChange={(e) => setSenhaConfirmacao(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFechar} color="inherit">Cancelar</Button>
        <Button 
          onClick={handleConfirmar} 
          variant="contained" 
          color="error"
          disabled={!emailConfirmacao || !senhaConfirmacao}
        >
          CONFIRMAR EXCLUSÃO
        </Button>
      </DialogActions>
    </Dialog>
  );
}