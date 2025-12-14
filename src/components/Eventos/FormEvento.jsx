import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  InputAdornment
} from '@mui/material';
import {
  Event as EventIcon,
  Place as PlaceIcon
} from '@mui/icons-material';
import { useMensagem } from '../../contexts/ContextoMensagem';

const statusOpcoes = ['ativo', 'inativo', 'cancelado', 'finalizado'];

export default function FormEvento({ aberto, aoFechar, aoSalvar, eventoInicial }) {
  const { aviso } = useMensagem();
  
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
        // Corta os segundos para caber no input datetime-local (YYYY-MM-DDTHH:mm)
        data_evento: eventoInicial.data_evento 
          ? new Date(eventoInicial.data_evento).toISOString().slice(0, 16) 
          : '',
        local: eventoInicial.local || '',
        status: eventoInicial.status || 'ativo'
      });
    } else {
      setForm({ titulo: '', descricao: '', data_evento: '', local: '', status: 'ativo' });
    }
  }, [eventoInicial, aberto]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const salvar = () => {
    if (!form.titulo || form.titulo.length < 3) {
      return aviso('O título deve ter no mínimo 3 caracteres.');
    }
    if (!form.data_evento) {
      return aviso('Por favor, selecione a data e hora do evento.');
    }
    if (!form.local) {
      return aviso('O local do evento é obrigatório.');
    }

    // Garante que a data está em ISO completo para o backend
    const payload = {
      ...form,
      data_evento: new Date(form.data_evento).toISOString()
    };
    
    aoSalvar(payload);
  };

  return (
    <Dialog 
      open={aberto} 
      onClose={aoFechar} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #f3f4f6', pb: 2, fontWeight: 'bold' }}>
        {eventoInicial ? '✏️ Editar Evento' : '📅 Novo Evento'}
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Título do Evento"
            name="titulo"
            value={form.titulo}
            onChange={onChange}
            fullWidth
            required
            InputProps={{
              startAdornment: <InputAdornment position="start"><EventIcon color="action" /></InputAdornment>,
            }}
          />
          
          <Box display="flex" gap={2}>
            <TextField
              label="Data e Hora"
              type="datetime-local"
              name="data_evento"
              value={form.data_evento}
              onChange={onChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={onChange}
              fullWidth
            >
              {statusOpcoes.map(s => (
                <MenuItem key={s} value={s}>
                  <Typography sx={{ textTransform: 'capitalize' }}>{s}</Typography>
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            label="Local"
            name="local"
            value={form.local}
            onChange={onChange}
            fullWidth
            required
            InputProps={{
              startAdornment: <InputAdornment position="start"><PlaceIcon color="action" /></InputAdornment>,
            }}
          />

          <TextField
            label="Descrição (Opcional)"
            name="descricao"
            value={form.descricao}
            onChange={onChange}
            fullWidth
            multiline
            rows={3}
            placeholder="Detalhes adicionais sobre o evento..."
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #f3f4f6', bgcolor: '#fafafa' }}>
        <Button 
          onClick={aoFechar} 
          sx={{ color: '#6b7280', fontWeight: 600, textTransform: 'none' }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={salvar} 
          variant="contained" 
          sx={{ 
            bgcolor: '#1976d2', 
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3 
          }}
        >
          Salvar Evento
        </Button>
      </DialogActions>
    </Dialog>
  );
}