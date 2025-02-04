import 'dotenv/config';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { db } from '../src/db/index.js';
import app from '../testHelper/testHelper';

jest.mock('../src/db/index.js');

const secret = process.env.JWT_SECRET!;

const mockUserAuthHeader = { Authorization: jwt.sign({ userId: 1, role: 'user' }, secret) };

const mockSellerAuthHeader = { Authorization: jwt.sign({ userId: 1, role: 'seller' }, secret) };

const makeAuthenticatedRequest = async (method: string, url: string, data?: any, authHeader = mockUserAuthHeader) => {
  const response = await (request(app) as any)[method](url)
    .set(authHeader)
    .send(data);
  return response;
};

describe('Orders API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /orders', () => {
    it('should return 500 when database query fails', async () => {
      (db.select as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await makeAuthenticatedRequest('get', '/orders');
      expect(response.status).toBe(500);
    });

    it('should return all orders when authenticated', async () => {
      const mockOrders = [
        {
          id: 1,
          createdAt: new Date().toISOString(),
          status: 'Paid',
          userId: 1,
          stripePaymentIntentId: "pi_123",
        },
        {
          id: 2,
          createdAt: new Date().toISOString(),
          status: 'Shipped',
          userId: 3,
          stripePaymentIntentId: "pi_456"
        }
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue(mockOrders)
      });

      const response = await makeAuthenticatedRequest('get', '/orders');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrders);
    });
  });

  describe('POST /orders', () => {
    it('should return 401 when userId is missing', async () => {
      const newOrder = {
        order: {},
        items: [{ productId: 1, quantity: 2, price: 100 }]
      };

      const WrongAuthHeader = { Authorization: jwt.sign({}, secret) };

      const response = await makeAuthenticatedRequest('post', '/orders', newOrder, WrongAuthHeader);
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Access denied" });
    });

    it('should create a new order when authenticated as user', async () => {
      const newOrder = {
        order: {},
        items: [{ productId: 1, quantity: 2, price: 100 }]
      };

      const createdOrder = {
        id: 1,
        userId: 1,
        status: 'New',
        createdAt: new Date().toISOString(),
        items: [{ id: 1, orderId: 1, productId: 1, quantity: 2, price: 100 }]
      };

      (db.insert as jest.Mock)
        .mockImplementationOnce(() => ({
          values: jest.fn().mockReturnThis(),
          returning: jest.fn().mockResolvedValue([{ id: 1, userId: 1 }])
        }))
        .mockImplementationOnce(() => ({
          values: jest.fn().mockReturnThis(),
          returning: jest.fn().mockResolvedValue(createdOrder.items)
        }));

      const response = await makeAuthenticatedRequest('post', '/orders', newOrder);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        items: expect.arrayContaining([
          expect.objectContaining({
            productId: expect.any(Number),
            quantity: expect.any(Number),
            price: expect.any(Number)
          })
        ])
      }));
    });

    it('should return 400 when order items are invalid', async () => {
      const invalidOrder = {
        order: {},
        items: [{ productId: 1, quantity: -1, price: 100 }]
      };

      const response = await makeAuthenticatedRequest('post', '/orders', invalidOrder);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return 500 when database query fails', async () => {
      (db.select as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await makeAuthenticatedRequest('get', '/orders/1');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('should return order by id when authenticated', async () => {
      const mockOrderWithItems = [{
        orders: {
          id: 1,
          userId: 1,
          status: 'New',
          createdAt: new Date().toISOString()
        },
        order_items: {
          id: 1,
          orderId: 1,
          productId: 1,
          quantity: 2,
          price: 100
        }
      }];

      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockResolvedValue(mockOrderWithItems)
      }));

      const response = await makeAuthenticatedRequest('get', '/orders/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        items: expect.any(Array)
      }));
    });

    it('should return 404 when order not found', async () => {
      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockResolvedValue([])
      }));

      const response = await makeAuthenticatedRequest('get', '/orders/999');
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /orders/:id', () => {
    it('should return 500 when database update fails', async () => {
      (db.update as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await makeAuthenticatedRequest('put', '/orders/1', { status: 'Shipped' }, mockSellerAuthHeader);
      expect(response.status).toBe(500);
    });

    it('should update order status when authenticated as seller', async () => {
      const updatedFields = { status: 'Shipped' };
      const updatedOrder = { id: 1, ...updatedFields };

      (db.update as jest.Mock).mockImplementation(() => ({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([updatedOrder])
      }));

      const response = await makeAuthenticatedRequest('put', '/orders/1', updatedFields, mockSellerAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedOrder);
    });

    it('should return 403 when user role tries to update status', async () => {
      const updatedFields = { status: 'Shipped' };
      const response = await makeAuthenticatedRequest('put', '/orders/1', updatedFields, mockUserAuthHeader);
      expect(response.status).toBe(403);
    });

    it('should return 404 when updating non-existent order', async () => {
      (db.update as jest.Mock).mockImplementation(() => ({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([])
      }));

      const response = await makeAuthenticatedRequest('put', '/orders/999', { status: 'Paid' }, mockSellerAuthHeader);
      expect(response.status).toBe(404);
    });

    it('should return 400 when status is invalid', async () => {
      const invalidStatus = { status: 'Processing' };
      const response = await makeAuthenticatedRequest('put', '/orders/1', invalidStatus, mockSellerAuthHeader);
      expect(response.status).toBe(400);
    });
  });
});
