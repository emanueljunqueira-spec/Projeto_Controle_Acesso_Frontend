import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { Paper, Typography, Box, List, ListItem, ListItemText, Chip, Divider } from '@mui/material';
import { 
  CheckCircle as EntradaIcon, 
  ExitToApp as SaidaIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon
} from '@mui/icons-material';

export default function MonitorAcessos() {
  const [acessos, setAcessos] = useState([]);
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    // CONEXÃO VIA WEBSOCKETS (Porta 8000 para HiveMQ)
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    client.on('connect', () => {
      console.log('📡 Frontend conectado ao MQTT!');
      setConectado(true);
      // Inscreve no tópico que o Backend alimenta
      client.subscribe('sistema-rfid/monitor');
    });

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        
        // Adiciona o novo acesso no topo da lista
        setAcessos((prev) => [payload, ...prev].slice(0, 10)); // Mantém apenas os últimos 10
      } catch (err) {
        console.error('Erro ao ler JSON do MQTT:', err);
      }
    });

    client.on('offline', () => setConectado(false));

    // Limpeza ao sair da tela
    return () => {
      if (client) client.end();
    };
  }, []);

  return (
    <Paper sx={{ p: 2, height: '100%', minHeight: 400, bgcolor: '#f8f9fa' }}>
      {/* Cabeçalho do Monitor */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          🔴 Acessos em Tempo Real
        </Typography>
        <Chip 
          icon={conectado ? <WifiIcon /> : <WifiOffIcon />}
          label={conectado ? 'Ao Vivo' : 'Desconectado'} 
          color={conectado ? 'success' : 'default'} 
          size="small" 
          variant="outlined"
        />
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* Lista de Acessos */}
      {acessos.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="body2" color="textSecondary">
            Aguardando leituras...
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Passe um cartão no leitor.
          </Typography>
        </Box>
      ) : (
        <List dense>
          {acessos.map((acesso, index) => (
            <Paper key={index} elevation={1} sx={{ mb: 1, p: 0.5, bgcolor: 'white' }}>
              <ListItem>
                <Box mr={2} display="flex" alignItems="center">
                  {acesso.tipo === 'entrada' ? (
                    <EntradaIcon color="success" fontSize="large" />
                  ) : (
                    <SaidaIcon color="warning" fontSize="large" />
                  )}
                </Box>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight="bold">
                      {acesso.participante}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="textSecondary">
                      {acesso.tipo.toUpperCase()} • {new Date(acesso.horario).toLocaleTimeString()}
                    </Typography>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Paper>
  );
}