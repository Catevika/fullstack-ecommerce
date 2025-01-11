import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from '../../db/index.js';
import { orderItemsTable } from '../../db/schema/ordersSchema.js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Stripe secret key is not defined');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

export async function getKeys(_req: Request, res: Response) {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    res.status(500).json({ error: 'Stripe publishable key not configured' });
  }

  res.json({ publishableKey });
}

export async function createPaymentIntent(req: Request, res: Response) {
  const { orderId } = req.body;
  // const order = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
  const orderItems = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const amount = Math.floor(total * 100);

  if (amount === 0) {
    res.status(400).json({ error: 'Order is empty' });
    return;
  }

  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2024-12-18.acacia' }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer: customer.id,
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
}
