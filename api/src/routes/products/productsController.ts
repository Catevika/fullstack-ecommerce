import { Request, Response } from 'express';
export function listProducts(_req: Request, res: Response) {
  res.send('listProducts');
}

export function getProductById(req: Request, res: Response) {
  const id = req.params.id;
  res.send('getProductById' + id);
}

export function createProduct(_req: Request, res: Response) {
  res.send('createProduct');
}

export function updateProduct(req: Request, res: Response) {
  const id = req.params.id;
  res.send('updateProduct with id ' + id);
}

export function deleteProduct(req: Request, res: Response) {
  const id = req.params.id;
  res.send('deleteProduct with id ' + id);
}