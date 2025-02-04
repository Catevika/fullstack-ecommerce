import { doublePrecision, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
export const productsTable = pgTable('products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image: varchar({ length: 255 }),
  price: doublePrecision().notNull(),
});

const baseProductSchema = createInsertSchema(productsTable);

export const createProductSchema = baseProductSchema.extend({
  name: z.string().min(1),
  price: z.number().min(0.01)
});

export const updateProductSchema = baseProductSchema.partial().extend({
  name: z.string().min(1).optional(),
  price: z.number().min(0.01).optional()
});