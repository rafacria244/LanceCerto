import rateLimit from 'express-rate-limit';

// Rate limiter para geração de propostas (mais restritivo)
export const proposalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo de 10 requisições por 15 minutos
  message: {
    error: 'Muitas requisições de geração de propostas. Tente novamente em 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Identificar por userId se disponível, senão por IP
  keyGenerator: (req) => {
    return req.body?.userId || req.ip;
  }
});

// Rate limiter para API geral
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de 100 requisições por 15 minutos
  message: {
    error: 'Muitas requisições. Tente novamente em alguns minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para autenticação (prevenir brute force)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo de 5 tentativas por hora
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 1 hora.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para webhooks do Stripe
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // máximo de 30 webhooks por minuto
  message: {
    error: 'Webhook rate limit exceeded',
    code: 'WEBHOOK_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
