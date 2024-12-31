import { doublePrecision, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { productsTable } from './productsSchema.js';
import { usersTable } from './usersSchema.js';

export const ordersTable = pgTable('orders', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp().notNull().defaultNow(),
  status: varchar({ length: 50 }).notNull().default('new'),
  userId: integer().references(() => usersTable.id).notNull()
});

export const orderItemsTable = pgTable('order_items', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer().references(() => ordersTable.id).notNull(),
  productId: integer().references(() => productsTable.id).notNull(),
  quantity: integer().notNull(),
  price: doublePrecision().notNull()
});

export const createOrderSchema = createInsertSchema(ordersTable).omit({ userId: true, status: true, createdAt: true });

export const insertOrderItemSchema = createInsertSchema(orderItemsTable).omit({ orderId: true });

export const insertOrderWithItemsSchema = z.object({
  order: createOrderSchema,
  items: z.array(insertOrderItemSchema)
});
