import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Card,
  CardContent
} from '@mui/material';
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
    // CONEXÃO VIA WEBSOCKETS (Porta 8884 para HiveMQ)
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    client.on('connect', () => {
      console.log('📡 Frontend conectado ao MQTT!');
      setConectado(true);
      // Inscreve no tópico que o Backend alimenta
      client.subscribe('sistema-rfid/monitor', (err) => {
        if (err) console.error('Erro ao se inscrever:', err);
      });
    });

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());

        // Adiciona o novo acesso no topo da lista
        setAcessos((prev) => [payload, ...prev].slice(0, 20)); // Mantém os últimos 20
      } catch (err) {
        console.error('Erro ao ler JSON do MQTT:', err);
      }
    });

    client.on('offline', () => {
      console.log('⚠️  MQTT desconectado');
      setConectado(false);
    });

    client.on('error', (err) => {
      console.error('❌ Erro no MQTT:', err);
    });

    // LIMPEZA CRÍTICA: Executa ao desmontar o componente
    return () => {
      console.log('🧹 Limpando conexão MQTT...');
      if (client && client.connected) {
        client.unsubscribe('sistema-rfid/monitor', (err) => {
          if (err) console.error('Erro ao desinscrever:', err);
        });
        // Desconecta de forma segura: força = true para fechar imediatamente
        client.end(true, { force: true }, () => {
          console.log('✅ Conexão MQTT encerrada');
        });
      }
    };
  }, []); // Dependency array vazio: executa apenas uma vez ao montar

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        minHeight: 500,
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' // Sombra suave
      }}
    >
      {/* Cabeçalho do Monitor */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        sx={{ flexWrap: 'wrap', gap: 1 }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="700"
            color="#1a1a1a"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            🔴 Acessos em Tempo Real
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Últimos acessos registrados via MQTT
          </Typography>
        </Box>

        <Chip
          icon={conectado ? <WifiIcon /> : <WifiOffIcon />}
          label={conectado ? 'Ao Vivo' : 'Desconectado'}
          color={conectado ? 'success' : 'default'}
          size="small"
          variant="outlined"
          sx={{ minWidth: 120 }}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Lista de Acessos */}
      {acessos.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            ⏳ Aguardando leituras...
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Passe um cartão RFID no leitor para registrar um acesso
          </Typography>
        </Box>
      ) : (
        <List dense sx={{ maxHeight: '70vh', overflow: 'auto' }}>
          {acessos.map((acesso, index) => (
            <Card
              key={index}
              elevation={0}
              sx={{
                mb: 1.5,
                p: 0,
                border: '1px solid #f0f0f0',
                bgcolor: acesso.tipo === 'entrada' ? '#f0f9ff' : '#fffbf0',
                borderLeft: `4px solid ${
                  acesso.tipo === 'entrada' ? '#22c55e' : '#f59e0b'
                }`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transform: 'translateX(2px)'
                }
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
                <Box mr={2} display="flex" alignItems="center">
                  {acesso.tipo === 'entrada' ? (
                    <EntradaIcon
                      sx={{ color: '#22c55e', fontSize: 28 }}
                    />
                  ) : (
                    <SaidaIcon
                      sx={{ color: '#f59e0b', fontSize: 28 }}
                    />
                  )}
                </Box>

                <Box flex={1}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="600"
                    color="#1a1a1a"
                  >
                    {acesso.participante || 'Participante desconhecido'}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 0.5
                    }}
                  >
                    <span
                      style={{
                        backgroundColor:
                          acesso.tipo === 'entrada' ? '#22c55e' : '#f59e0b',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}
                    >
                      {acesso.tipo.toUpperCase()}
                    </span>
                    {acesso.horario &&
                      new Date(acesso.horario).toLocaleTimeString('pt-BR')}
                  </Typography>
                </Box>

                {acesso.status === 'sucesso' && (
                  <Chip
                    label="✓ Sucesso"
                    size="small"
                    color="success"
                    variant="filled"
                    sx={{ ml: 1 }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Paper>
  );
}