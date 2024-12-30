import { Router } from 'express';
import { createProductSchema, updateProductSchema } from '../../db/schema/productsSchema';
import { validateData } from '../../middlewares/validationMiddleware';
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from './productsController';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProductById);
router.post('/', validateData(createProductSchema), createProduct);
router.put('/:id', validateData(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;