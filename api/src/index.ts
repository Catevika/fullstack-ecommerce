import express, { json, urlencoded } from 'express';
import serverless from "serverless-http";
import authRoutes from './routes/auth/index.js';
import ordersRoutes from './routes/orders/index.js';
import productsRoutes from './routes/products/index.js';

const port = 3000;

const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));

// app.get('/', (_req, res) => {
//   res.send('Hello World 123');
// });

app.use('/products', productsRoutes);
app.use('/auth', authRoutes);
app.use('/orders', ordersRoutes);

if (process.env.NODE_ENV === "dev") {
  app.listen(port, () => {
    console.log('Server is running on port', port);
  });
}

export const handler = serverless(app);