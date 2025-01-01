import { RequestHandler, Router } from 'express';
import { insertOrderWithItemsSchema, updateOrderSchema } from '../../db/schema/ordersSchema.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';
import { validateData } from '../../middlewares/validationMiddleware.js';
import { createOrder, getOrderById, listOrders, updateOrder } from './ordersController.js';

const router = Router();

router.post('/', verifyToken, validateData(insertOrderWithItemsSchema), createOrder as RequestHandler);
router.get('/', verifyToken, listOrders);
router.get('/:id', verifyToken, getOrderById);
router.put('/:id', verifyToken, validateData(updateOrderSchema), updateOrder);

export default router;