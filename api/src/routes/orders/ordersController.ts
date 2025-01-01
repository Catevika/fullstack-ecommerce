import { eq } from 'drizzle-orm/expressions.js';
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

// req.role: admin - list all orders
// req.role: seller - list orders by req.sellerId
// req.role: user - list orders by req.userId

export async function listOrders(_req: Request, res: Response) {
  try {
    const orders = await db.select().from(ordersTable);
    res.json(orders);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    const orderWithItems = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId));
    if (orderWithItems.length === 0) {
      res.status(404).send({ error: 'Order not found' });
      return;
    }
    const mergedOrder = {
      ...orderWithItems[0].orders,
      items: orderWithItems.map((item) => (item.order_items)),
    };
    res.status(200).json(mergedOrder);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    const [updatedOrder] = await db.update(ordersTable).set(req.body).where(eq(ordersTable.id, id)).returning();

    if (!updatedOrder) {
      res.status(404).send('Order not found');
    } else {
      res.status(200).json(updatedOrder);
    }
  } catch (error) {
    res.status(500).send(error);
  }
}