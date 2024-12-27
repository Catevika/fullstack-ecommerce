import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../../db/index';
import { productsTable } from '../../db/schema/productsSchema';
export async function listProducts(_req: Request, res: Response) {
  try {
    const products = await db.select().from(productsTable);
    res.json(products);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, Number(id)));
    if (!product) {
      res.status(404).send({ error: 'Product not found' });
      return;
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const [product] = await db.insert(productsTable).values(req.body).returning();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const [product] = await db.update(productsTable).set(updatedFields).where(eq(productsTable.id, Number(id))).returning();
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).send({ error: 'Product not found' });
      return;
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const [deletedProduct] = await db.delete(productsTable).where(eq(productsTable.id, Number(id))).returning();
    if (deletedProduct) {
      res.status(204).send({ message: 'Product deleted' });
    } else {
      res.status(404).send({ error: 'Product not found' });
      return;
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}