import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import stripeRoutes from '../routes/stripe.js';

// Mock do Supabase
const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    upsert: () => Promise.resolve({ data: null, error: null }),
    update: () => ({
      eq: () => Promise.resolve({ data: null, error: null })
    })
  })
};

describe('Stripe Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api', stripeRoutes);
  });

  describe('POST /api/create-checkout-session', () => {
    it('deve retornar erro 400 se priceId ou userId estiverem faltando', async () => {
      const response = await request(app)
        .post('/api/create-checkout-session')
        .send({ priceId: 'price_123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('deve retornar erro 400 se priceId for inválido', async () => {
      const response = await request(app)
        .post('/api/create-checkout-session')
        .send({ 
          priceId: 'prod_invalid', // Product ID ao invés de Price ID
          userId: 'user_123' 
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_PRICE_ID');
    });

    it('deve retornar erro 503 se Stripe não estiver configurado', async () => {
      // Stripe não configurado no ambiente de teste
      const response = await request(app)
        .post('/api/create-checkout-session')
        .send({ 
          priceId: 'price_123456789',
          userId: 'user_123' 
        });

      expect(response.status).toBe(503);
      expect(response.body.code).toBe('STRIPE_NOT_CONFIGURED');
    });
  });

  describe('POST /api/create-portal-session', () => {
    it('deve retornar erro 400 se userId estiver faltando', async () => {
      const response = await request(app)
        .post('/api/create-portal-session')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('deve retornar erro 503 se Stripe não estiver configurado', async () => {
      const response = await request(app)
        .post('/api/create-portal-session')
        .send({ userId: 'user_123' });

      expect(response.status).toBe(503);
      expect(response.body.code).toBe('STRIPE_NOT_CONFIGURED');
    });
  });
});
