import express from 'express';
import productsRouter from './routes/products/index.ts';

const port = 3000;

const app = express();

app.get('/', (_req, res) => {
  res.send('Hello World 123');
});

// products endpoints

app.use('/products', productsRouter);

app.listen(port, () => {
  console.log('Server is running on port', port);
});