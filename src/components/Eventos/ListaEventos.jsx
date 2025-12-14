import React from 'react';
import { Grid, Paper, Box, Typography, Chip, Button } from '@mui/material';
import { 
  People as PeopleIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Event as EventIcon 
} from '@mui/icons-material';

// Função auxiliar para formatar data sem travar se vier nulo
function formatarData(iso) {
  if (!iso) return 'Data indefinida';
  try { 
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }); 
  } catch { 
    return iso; 
  }
}

export default function ListaEventos({ eventos, onEditar, onExcluir, onVerParticipantes }) {
  return (
    <Grid container spacing={3}>
      {eventos.map((ev) => (
        <Grid item xs={12} md={6} lg={4} key={ev.id}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.5,
              height: '100%',
              borderRadius: 2,
              borderLeft: ev.status === 'ativo' ? '4px solid #2e7d32' : '4px solid #bdbdbd'
            }}
          >
            {/* Cabeçalho do Card */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box display="flex" gap={1} alignItems="center">
                <EventIcon color="primary" />
                <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
                  {ev.titulo}
                </Typography>
              </Box>
              <Chip 
                label={ev.status} 
                color={ev.status === 'ativo' ? 'success' : 'default'} 
                size="small" 
                sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '0.7rem' }}
              />
            </Box>

            {/* Detalhes */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Data:</strong> {formatarData(ev.data_evento)}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Local:</strong> {ev.local}
              </Typography>
              {ev.descricao && (
                <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                  {ev.descricao}
                </Typography>
              )}
            </Box>

            {/* Ações */}
            <Box display="flex" gap={1} mt={1} flexWrap="wrap">
               {/* Botão Principal: Ver Participantes */}
               <Button 
                size="small" 
                variant="contained" 
                color="primary" 
                fullWidth
                startIcon={<PeopleIcon />}
                onClick={() => onVerParticipantes(ev)}
                sx={{ mb: 1 }}
              >
                Gerenciar Participantes
              </Button>

              <Box display="flex" gap={1} width="100%">
                <Button 
                  size="small" 
                  variant="outlined" 
                  startIcon={<EditIcon />}
                  onClick={() => onEditar(ev)}
                  sx={{ flex: 1 }}
                >
                  Editar
                </Button>
                <Button 
                  size="small" 
                  variant="outlined" 
                  color="error" 
                  startIcon={<DeleteIcon />}
                  onClick={() => onExcluir(ev)}
                  sx={{ flex: 1 }}
                >
                  Excluir
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}