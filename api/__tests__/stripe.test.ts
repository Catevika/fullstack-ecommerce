import 'dotenv/config';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { db } from '../src/db/index.js';
import app from '../testHelper/testHelper';

jest.mock('../src/db/index.js');

const secret = process.env.JWT_SECRET!;

const mockUserAuthHeader = { Authorization: jwt.sign({ userId: 1, role: 'user' }, secret) };

describe('Stripe API', () => {
  jest.mock('stripe', () => {
    return jest.fn().mockImplementation(() => ({
      customers: {
        create: jest.fn().mockResolvedValue({ id: 'cus_123' })
      },
      ephemeralKeys: {
        create: jest.fn().mockResolvedValue({ secret: 'ek_123' })
      },
      paymentIntents: {
        create: jest.fn().mockResolvedValue({
          id: 'pi_123',
          client_secret: 'pi_123_secret'
        })
      }
    }));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /payment-intent', () => {
    it('should create payment intent for valid order', async () => {
      const mockOrderItems = [
        { price: 100, quantity: 2 }
      ];

      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(mockOrderItems)
      }));

      (db.update as jest.Mock).mockImplementation(() => ({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([{ id: 1 }])
      }));

      const response = await request(app)
        .post('/stripe/payment-intent')
        .set(mockUserAuthHeader)
        .send({ orderId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('paymentIntent');
      expect(response.body).toHaveProperty('ephemeralKey');
      expect(response.body).toHaveProperty('customer');
    });
  });
});
