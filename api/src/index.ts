import express, { json, urlencoded } from 'express';
import serverless from "serverless-http";
import authRoutes from './routes/auth/index.js';
import ordersRoutes from './routes/orders/index.js';
import productsRoutes from './routes/products/index.js';
import stripeRoutes from './routes/stripe/index.js';
import { webhook } from './routes/stripe/stripeController.js';

const port = process.env.PORT || 3000;

const app = express();

app.use('/stripe/webhook', express.raw({ type: 'application/json' }), webhook);

app.use(json());
app.use(urlencoded({ extended: false }));

// app.get('/', (_req, res) => {
//   res.send('Hello World 123');
// });

app.use('/products', productsRoutes);
app.use('/auth', authRoutes);
app.use('/orders', ordersRoutes);
app.use('/stripe', stripeRoutes);

if (process.env.NODE_ENV === "dev") {
  app.listen(port, () => {
    console.log('Server is running on port', port);
  });
}

export const handler = serverless(app);