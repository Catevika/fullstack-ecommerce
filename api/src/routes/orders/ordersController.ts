import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { orderItemsTable, ordersTable } from '../../db/schema/ordersSchema.js';

export async function createOrder(req: Request, res: Response) {
  try {
    const { items } = req.body;

    const userId = req.userId;
    if (!userId) {
      return res.status(401).send({ error: "Invalid order data" });
    }

    const [newOrder] = await db.insert(ordersTable).values({ userId: Number(userId) }).returning();

    const itemsOfOrder = items.map((item: any) => ({ ...item, orderId: newOrder.id }));
    const orderItems = await db.insert(orderItemsTable).values(itemsOfOrder).returning();

    res.status(201).json({ ...newOrder, items: orderItems });
    return;
  } catch (error) {
    res.status(400).send({ error: "Invalid order data" });
  }
}