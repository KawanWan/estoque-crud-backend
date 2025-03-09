import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProducts);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;