import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from '../../db/index.js';
import { orderItemsTable, ordersTable } from '../../db/schema/ordersSchema.js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Stripe secret key is not defined');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-01-27.acacia',
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

  await db.update(ordersTable).set({ stripePaymentIntentId: paymentIntent.id }).where(eq(ordersTable.id, orderId));

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
}

export async function webhook(req: Request, res: Response) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    throw new Error('Stripe webhook secret is not defined');
  }

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.status(400).send('Missing stripe-signature header');
    return;
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error}`);
    return;
  }
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent);
      await db.update(ordersTable).set({ status: 'paid' }).where(eq(ordersTable.stripePaymentIntentId, paymentIntent.id));
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object;
      console.log('PaymentIntent failed!', paymentIntentFailed);
      await db.update(ordersTable).set({ status: 'payment_failed' }).where(eq(ordersTable.stripePaymentIntentId, paymentIntentFailed.id));
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
}