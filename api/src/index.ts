import express, { json, urlencoded } from 'express';
import authRoutes from './routes/auth';
import productsRouter from './routes/products';

const port = 3000;

const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));

// app.get('/', (_req, res) => {
//   res.send('Hello World 123');
// });

app.use('/products', productsRouter);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log('Server is running on port', port);
});