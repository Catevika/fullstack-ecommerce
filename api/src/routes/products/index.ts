import { Router } from 'express';
import { createProductSchema, updateProductSchema } from '../../db/schema/productsSchema.js';
import { verifySeller, verifyToken } from '../../middlewares/authMiddleware.js';
import { validateData } from '../../middlewares/validationMiddleware.js';
import { createProduct, getProductById, listProducts, updateProduct } from './productsController.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, verifySeller, validateData(createProductSchema), createProduct);
router.put('/:id', verifyToken, verifySeller, validateData(updateProductSchema), updateProduct);

export default router;