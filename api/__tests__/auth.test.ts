import bcrypt from 'bcryptjs';
import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { db } from '../src/db/index';

import authRouter from '../src/routes/auth/index';

jest.mock('../src/db/index');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    const validUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'user'
    };

    it('should successfully register a new user', async () => {
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hashSync as jest.Mock).mockReturnValue(hashedPassword);
      (jwt.sign as jest.Mock).mockReturnValue('fake.jwt.token');

      const mockUser = { ...validUser, id: 1, password: hashedPassword };
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockUser])
        })
      });

      const response = await request(app)
        .post('/auth/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', validUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should handle registration errors', async () => {
      (db.insert as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .post('/auth/register')
        .send(validUser);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Something went wrong');
    });
  });

  describe('POST /auth/login', () => {
    const loginCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    it('should successfully login an existing user', async () => {
      const mockUser = {
        id: 1,
        email: loginCredentials.email,
        password: 'hashedPassword',
        role: 'user'
      };

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockUser])
        })
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('fake.jwt.token');

      const response = await request(app)
        .post('/auth/login')
        .send(loginCredentials);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', loginCredentials.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject non-existent user', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([])
        })
      });

      const response = await request(app)
        .post('/auth/login')
        .send(loginCredentials);

      expect(response.status).toBe(401);
      expect(response.text).toBe('Authentication failed');
    });

    it('should reject invalid password', async () => {
      const mockUser = {
        id: 1,
        email: loginCredentials.email,
        password: 'hashedPassword',
        role: 'user'
      };

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockUser])
        })
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/login')
        .send(loginCredentials);

      expect(response.status).toBe(401);
      expect(response.text).toBe('Login failed');
    });

    it('should handle login errors', async () => {
      (db.select as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .post('/auth/login')
        .send(loginCredentials);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Something went wrong');
    });
  });
});
