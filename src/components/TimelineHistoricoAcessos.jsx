import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot
} from '@mui/lab';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import {
  CheckCircle as EntradaIcon,
  ExitToApp as SaidaIcon,
  Block as NegadoIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Componente de Timeline para visualizar o histórico de acessos de um participante
 * Mostra entrada/saída/negado em um formato visual e elegante
 *
 * @param {Array} historico_acessos - Array com objetos: { tipo, data_hora, mensagem }
 * @example
 * const historico = [
 *   { tipo: 'entrada', data_hora: '2025-12-11T14:30:00Z', mensagem: 'Acesso via MQTT' },
 *   { tipo: 'saida', data_hora: '2025-12-11T12:15:00Z', mensagem: 'Acesso via MQTT' }
 * ]
 * <TimelineHistoricoAcessos historico={historico} />
 */
export default function TimelineHistoricoAcessos({ historico_acessos = [] }) {
  if (!historico_acessos || historico_acessos.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          bgcolor: '#fafafa',
          borderRadius: 2,
          border: '1px solid #e0e0e0'
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Nenhum registro de acesso para este participante
        </Typography>
      </Box>
    );
  }

  /**
   * Determina a cor e ícone baseado no tipo de movimento
   */
  const obterIconeETipografia = (tipo) => {
    switch (tipo) {
      case 'entrada':
        return {
          icone: <EntradaIcon sx={{ color: 'white' }} />,
          dotColor: '#22c55e', // Verde
          bgColor: '#dcfce7',
          textColor: '#166534',
          badge: 'ENTRADA'
        };
      case 'saida':
        return {
          icone: <SaidaIcon sx={{ color: 'white' }} />,
          dotColor: '#f59e0b', // Laranja
          bgColor: '#fef3c7',
          textColor: '#92400e',
          badge: 'SAÍDA'
        };
      case 'negado':
        return {
          icone: <NegadoIcon sx={{ color: 'white' }} />,
          dotColor: '#ef4444', // Vermelho
          bgColor: '#fee2e2',
          textColor: '#7f1d1d',
          badge: 'NEGADO'
        };
      default:
        return {
          icone: null,
          dotColor: '#6b7280',
          bgColor: '#f3f4f6',
          textColor: '#374151',
          badge: 'DESCONHECIDO'
        };
    }
  };

  /**
   * Formata a data/hora para um formato legível
   */
  const formatarDataHora = (dataHora) => {
    try {
      const data = parseISO(dataHora);
      return format(data, "dd 'de' MMMM 'de' yyyy 'às' HH:mm:ss", {
        locale: ptBR
      });
    } catch (err) {
      return dataHora;
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Timeline position="alternate-reverse">
        {historico_acessos.map((acesso, index) => {
          const { icone, dotColor, bgColor, textColor, badge } =
            obterIconeETipografia(acesso.tipo);
          const ehUltimo = index === 0;

          return (
            <TimelineItem key={index}>
              {/* Data/Hora do lado oposto (desktop) */}
              <TimelineOppositeContent
                color="textSecondary"
                sx={{
                  flex: 0.3,
                  minWidth: 150,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                <Typography variant="caption" color="textSecondary">
                  {formatarDataHora(acesso.data_hora)}
                </Typography>
              </TimelineOppositeContent>

              {/* Timeline separador com ícone */}
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor: dotColor,
                    boxShadow: `0 0 0 8px ${bgColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    animation: ehUltimo ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.7 }
                    }
                  }}
                >
                  {icone}
                </TimelineDot>

                {/* Conector: não mostra no último item */}
                {index < historico_acessos.length - 1 && (
                  <TimelineConnector
                    sx={{
                      bgcolor: '#e5e7eb',
                      minHeight: '60px'
                    }}
                  />
                )}
              </TimelineSeparator>

              {/* Conteúdo do card */}
              <TimelineContent sx={{ flex: 0.7 }}>
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: bgColor,
                    border: `1px solid ${dotColor}33`,
                    borderRadius: 2
                  }}
                >
                  <CardContent sx={{ p: 1.5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 0.5
                      }}
                    >
                      <Chip
                        label={badge}
                        size="small"
                        sx={{
                          bgcolor: dotColor,
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                      {ehUltimo && (
                        <Chip
                          label="🔴 Mais Recente"
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: '0.65rem' }}
                        />
                      )}
                    </Box>

                    {/* Mensagem */}
                    {acesso.mensagem && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: textColor,
                          fontWeight: 500,
                          mb: 0.5
                        }}
                      >
                        {acesso.mensagem}
                      </Typography>
                    )}

                    {/* Data/Hora no mobile */}
                    <Typography
                      variant="caption"
                      sx={{
                        color: textColor,
                        opacity: 0.8,
                        display: { xs: 'block', sm: 'none' }
                      }}
                    >
                      {formatarDataHora(acesso.data_hora)}
                    </Typography>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>

      {/* Resumo ao final */}
      <Box sx={{ mt: 2, p: 2, bgcolor: '#f9fafb', borderRadius: 2 }}>
        <Typography variant="caption" color="textSecondary">
          Total de registros: <strong>{historico_acessos.length}</strong>
        </Typography>
      </Box>
    </Box>
  );
}
