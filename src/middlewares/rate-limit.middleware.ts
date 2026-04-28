import rateLimit from 'express-rate-limit';

const rateLimitResponse = { errors: [{ message: 'Too many requests, please try again later' }] };

// General API: 120 req / min per IP
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse,
});

// Auth actions (login, signup, SSO): 20 req / 15 min per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse,
});

// Sensitive auth (password reset, OTP, account deletion): 5 req / 15 min per IP
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse,
});
