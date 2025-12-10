import React from 'react';
import { Grid, Paper, Box, Typography, Chip, Button } from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';

function formatarData(iso) {
  try { return new Date(iso).toLocaleString('pt-BR'); } catch { return iso; }
}

export default function ListaEventos({ eventos, onEditar, onExcluir, onVerParticipantes }) {
  return (
    <Grid container spacing={2}>
      {eventos.map(ev => (
        <Grid item xs={12} md={6} lg={4} key={ev.id}>
          <Paper sx={{ p:2, display:'flex', flexDirection:'column', gap:1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight="bold">{ev.titulo}</Typography>
              <Chip label={ev.status} color={ev.status === 'ativo' ? 'success' : 'default'} size="small" />
            </Box>
            <Typography variant="body2">Data: {formatarData(ev.data_evento)}</Typography>
            <Typography variant="body2">Local: {ev.local}</Typography>
            {ev.descricao && <Typography variant="body2" color="textSecondary">{ev.descricao}</Typography>}
            <Box display="flex" gap={1} mt={1}>
              <Button size="small" variant="outlined" onClick={() => onEditar(ev)}>Editar</Button>
              <Button size="small" variant="outlined" color="error" onClick={() => onExcluir(ev)}>Excluir</Button>
              <Button 
                size="small" 
                variant="contained" 
                color="primary" 
                startIcon={<PeopleIcon />}
                onClick={() => onVerParticipantes(ev)}
              >
                Ver Participantes
              </Button>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
