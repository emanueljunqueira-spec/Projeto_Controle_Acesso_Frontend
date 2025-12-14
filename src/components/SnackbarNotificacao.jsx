import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
  // CloseIcon removido daqui pois não era usado
} from '@mui/icons-material';
import { useMensagem } from '../contexts/ContextoMensagem';

export default function SnackbarNotificacao() {
  const { mensagens, fechar } = useMensagem();

  const configTipo = {
    sucesso: {
      severity: 'success',
      icon: <SuccessIcon fontSize="small" sx={{ mr: 1 }} />,
      bgColor: '#dcfce7'
    },
    erro: {
      severity: 'error',
      icon: <ErrorIcon fontSize="small" sx={{ mr: 1 }} />,
      bgColor: '#fee2e2'
    },
    aviso: {
      severity: 'warning',
      icon: <WarningIcon fontSize="small" sx={{ mr: 1 }} />,
      bgColor: '#fef3c7'
    },
    info: {
      severity: 'info',
      icon: <InfoIcon fontSize="small" sx={{ mr: 1 }} />,
      bgColor: '#e0f2fe'
    }
  };

  return (
    <Snackbar
      open={mensagens.length > 0}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ bottom: { xs: 24, sm: 24 }, right: { xs: 24, sm: 24 } }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {mensagens.map((msg, index) => {
          const config = configTipo[msg.tipo] || configTipo.info;
          const msgIndex = mensagens.length - 1 - index;

          return (
            <div
              key={msg.id}
              style={{
                marginBottom: msgIndex === 0 ? 0 : '10px',
                zIndex: msgIndex,
                transition: 'all 0.3s ease-in-out',
                opacity: msg.aberta ? 1 : 0,
                transform: msgIndex === 0 ? 'translateX(0)' : `translateY(-${msgIndex * 100}%) scale(${1 - msgIndex * 0.05})`,
                position: msgIndex === 0 ? 'relative' : 'absolute',
                bottom: msgIndex === 0 ? 'auto' : `${msgIndex * 10}px`,
                right: 0
              }}
            >
              <Alert
                onClose={() => fechar(msg.id)}
                severity={config.severity}
                variant="filled"
                icon={config.icon}
                sx={{
                  width: '100%',
                  minWidth: 300,
                  maxWidth: 500,
                  borderRadius: 1.5,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  // Aqui usamos cores personalizadas para garantir contraste
                  bgcolor: config.severity === 'error' ? '#ef4444' : 
                           config.severity === 'warning' ? '#f59e0b' : 
                           config.severity === 'success' ? '#22c55e' : '#3b82f6'
                }}
              >
                {msg.texto}
              </Alert>
            </div>
          );
        })}
      </div>
    </Snackbar>
  );
}