import React from 'react';
import { Box, Typography, Card, Grid } from '@mui/material';
import MonitorAcessos from '../components/MonitorAcessos';

export default function PaginaMonitor() {
  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          Monitoramento em Tempo Real
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Acompanhe o fluxo de entrada e saída ao vivo via MQTT.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <MonitorAcessos />
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, bgcolor: '#e3f2fd', border: '1px solid #90caf9' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Status do Sistema
            </Typography>
            <Typography variant="body2">
              🟢 <strong>Backend:</strong> Online
            </Typography>
            <Typography variant="body2">
              🟢 <strong>Broker MQTT:</strong> Conectado
            </Typography>
            <Typography variant="caption" display="block" mt={2} color="textSecondary">
              Os registros aparecem aqui instantaneamente quando um cartão é lido.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}