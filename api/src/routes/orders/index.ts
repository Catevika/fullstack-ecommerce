import { RequestHandler, Router } from 'express';
import { insertOrderWithItemsSchema } from '../../db/schema/ordersSchema.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';
import { validateData } from '../../middlewares/validationMiddleware.js';
import { createOrder } from './ordersController.js';

const router = Router();

router.post('/', verifyToken, validateData(insertOrderWithItemsSchema), createOrder as RequestHandler);

export default router;