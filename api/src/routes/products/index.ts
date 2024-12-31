import { Router } from 'express';
import { createProductSchema, updateProductSchema } from '../../db/schema/productsSchema';
import { verifySeller, verifyToken } from '../../middlewares/authMiddleware';
import { validateData } from '../../middlewares/validationMiddleware';
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from './productsController';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, verifySeller, validateData(createProductSchema), createProduct);
router.put('/:id', verifyToken, verifySeller, validateData(updateProductSchema), updateProduct);
router.delete('/:id', verifyToken, verifySeller, deleteProduct);

export default router;