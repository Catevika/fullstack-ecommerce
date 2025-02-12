import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { productsTable } from '../../db/schema/productsSchema.js';

export async function listProducts(_req: Request, res: Response) {
  try {
    const products = await db.select().from(productsTable).orderBy(productsTable.name);
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
    const updatedFields = req.cleanBody;
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

// export async function deleteProduct(req: Request, res: Response) {
//   const { id } = req.params;

//   try {
//     const [product] = await db.delete(productsTable).where(eq(productsTable.id, Number(id))).returning();
//     if (!product) {
//       res.status(404).send({ error: 'Product not found' });
//       return;
//     }
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).send({ error: error });
//   }
// }