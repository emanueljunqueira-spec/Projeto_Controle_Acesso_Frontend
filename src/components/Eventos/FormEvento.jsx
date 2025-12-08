import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material';

const statusOpcoes = ['ativo','inativo','cancelado','finalizado'];

export default function FormEvento({ aberto, aoFechar, aoSalvar, eventoInicial }) {
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    data_evento: '',
    local: '',
    status: 'ativo'
  });

  useEffect(() => {
    if (eventoInicial) {
      setForm({
        titulo: eventoInicial.titulo || '',
        descricao: eventoInicial.descricao || '',
        data_evento: eventoInicial.data_evento ? new Date(eventoInicial.data_evento).toISOString().slice(0,16) : '',
        local: eventoInicial.local || '',
        status: eventoInicial.status || 'ativo'
      });
    } else {
      setForm({ titulo: '', descricao: '', data_evento: '', local: '', status: 'ativo' });
    }
  }, [eventoInicial, aberto]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const salvar = () => {
    if (!form.titulo || form.titulo.length < 3) return alert('Título deve ter no mínimo 3 caracteres.');
    if (!form.local || form.local.length < 3) return alert('Local deve ter no mínimo 3 caracteres.');
    if (!form.data_evento) return alert('Data do evento é obrigatória.');

    // Converter para ISO completo com segundos
    const payload = {
      ...form,
      data_evento: new Date(form.data_evento).toISOString()
    };
    aoSalvar(payload);
  };

  return (
    <Dialog open={aberto} onClose={aoFechar} fullWidth maxWidth="sm">
      <DialogTitle>{eventoInicial ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
      <DialogContent>
        <TextField label="Título" name="titulo" value={form.titulo} onChange={onChange} fullWidth margin="dense" required />
        <TextField label="Descrição" name="descricao" value={form.descricao} onChange={onChange} fullWidth margin="dense" multiline rows={3} />
        <TextField label="Data do Evento" type="datetime-local" name="data_evento" value={form.data_evento} onChange={onChange} fullWidth margin="dense" required />
        <TextField label="Local" name="local" value={form.local} onChange={onChange} fullWidth margin="dense" required />
        <TextField select label="Status" name="status" value={form.status} onChange={onChange} fullWidth margin="dense">
          {statusOpcoes.map(s => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={aoFechar}>Cancelar</Button>
        <Button onClick={salvar} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}
