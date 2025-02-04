import express from 'express';
import { handler } from '../src/index';

// Create an Express app that uses the serverless handler
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Use the handler as middleware
app.use((req, res) => {
  // Convert the Express request and response objects into the format expected by the serverless handler
  const event = {
    httpMethod: req.method,
    path: req.path,
    headers: req.headers,
    queryStringParameters: req.query,
    body: JSON.stringify(req.body),
    isBase64Encoded: false,
  };

  // Call the serverless handler
  handler(event, {} as any)
    .then(({ statusCode, headers, body }: any) => {
      res.set(headers);
      res.status(statusCode).send(body);
    })
    .catch((err: any) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

export default app;