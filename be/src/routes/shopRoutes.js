import express from 'express';
import { getProductsByShop } from '../controllers/shopController.js';

const router = express.Router();

router.get('/:shopId/products', getProductsByShop);

export default router;
