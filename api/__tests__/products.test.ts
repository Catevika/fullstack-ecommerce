import 'dotenv/config';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { db } from '../src/db/index.js';
import app from '../testHelper/testHelper';

jest.mock('../src/db/index.js');

const secret = process.env.JWT_SECRET!;

const mockSellerAuthHeader = {
  Authorization: jwt.sign({ userId: 1, role: 'seller' }, secret)
};

const mockUserAuthHeader = {
  Authorization: jwt.sign({ userId: 1, role: 'user' }, secret)
};

const makeAuthenticatedRequest = async (method: string, url: string, data?: any, authHeader = mockSellerAuthHeader) => {
  const response = await (request(app) as any)[method](url)
    .set(authHeader)
    .send(data);
  return response;
};

describe('Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /products', () => {
    it('should return 500 when database query fails', async () => {
      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      const response = await makeAuthenticatedRequest('get', '/products');
      expect(response.status).toBe(500);
    });

    it('should return all products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product A', price: 100 },
        { id: 2, name: 'Product B', price: 200 }
      ];

      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(mockProducts)
      }));

      const response = await makeAuthenticatedRequest('get', '/products');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });
  });

  describe('GET /products/:id', () => {
    it('should return 500 when database query fails', async () => {
      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      const response = await makeAuthenticatedRequest('get', '/products/1');
      expect(response.status).toBe(500);
    });

    it('should return 404 when product is not found', async () => {
      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([])
      }));

      const response = await makeAuthenticatedRequest('get', '/products/999');
      expect(response.status).toBe(404);
    });

    it('should return 200 with product when found', async () => {
      const mockProduct = { id: 1, name: 'Test Product', price: 100 };

      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockProduct])
      }));

      const response = await makeAuthenticatedRequest('get', '/products/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProduct);
    });
  });

  describe('POST /products', () => {
    it('should return 500 when database insert fails', async () => {
      (db.insert as jest.Mock).mockImplementation(() => ({
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      const newProduct = { name: 'Test Product', price: 100 };
      const response = await makeAuthenticatedRequest('post', '/products', newProduct);
      expect(response.status).toBe(500);
    });

    it('should create a new product when authenticated as seller', async () => {
      const newProduct = { name: 'New Product', price: 150 };
      const createdProduct = { id: 1, ...newProduct };

      (db.insert as jest.Mock).mockImplementation(() => ({
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([createdProduct])
      }));

      const response = await makeAuthenticatedRequest('post', '/products', newProduct);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdProduct);
    });

    it('should return 403 when user role tries to create', async () => {
      const newProduct = { name: 'New Product', price: 150 };
      const response = await makeAuthenticatedRequest('post', '/products', newProduct, mockUserAuthHeader);
      expect(response.status).toBe(403);
    });

    it('should return 400 when product name is missing', async () => {
      const invalidProduct = { price: 150 };
      const response = await makeAuthenticatedRequest('post', '/products', invalidProduct);
      expect(response.status).toBe(400);
    });

    it('should return 400 when price is negative', async () => {
      const invalidProduct = { name: 'Test Product', price: -100 };
      const response = await makeAuthenticatedRequest('post', '/products', invalidProduct);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /products/:id', () => {
    it('should return 500 when database update fails', async () => {
      (db.update as jest.Mock).mockImplementation(() => ({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      const updatedFields = { name: 'Updated Product', price: 200 };
      const response = await makeAuthenticatedRequest('put', '/products/1', updatedFields);
      expect(response.status).toBe(500);
    });

    it('should update product when authenticated as seller', async () => {
      const updatedFields = { name: 'Updated Product', price: 200 };
      const updatedProduct = { id: 1, ...updatedFields };

      (db.update as jest.Mock).mockImplementation(() => ({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([updatedProduct])
      }));

      const response = await makeAuthenticatedRequest('put', '/products/1', updatedFields);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedProduct);
    });

    it('should return 403 when user role tries to update', async () => {
      const updatedFields = { name: 'Updated Product', price: 200 };
      const response = await makeAuthenticatedRequest('put', '/products/1', updatedFields, mockUserAuthHeader);
      expect(response.status).toBe(403);
    });

    it('should return 404 when updating non-existent product', async () => {
      (db.update as jest.Mock).mockImplementation(() => ({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([])
      }));

      const response = await makeAuthenticatedRequest('put', '/products/999', { name: 'Updated Product' });
      expect(response.status).toBe(404);
    });

    it('should return 400 when updating with negative price', async () => {
      const invalidUpdate = { price: -200 };
      const response = await makeAuthenticatedRequest('put', '/products/1', invalidUpdate);
      expect(response.status).toBe(400);
    });

    it('should return 400 when updating with empty name', async () => {
      const invalidUpdate = { name: '' };
      const response = await makeAuthenticatedRequest('put', '/products/1', invalidUpdate);
      expect(response.status).toBe(400);
    });
  });
});
