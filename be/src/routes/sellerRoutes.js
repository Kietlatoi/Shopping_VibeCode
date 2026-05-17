import express from 'express';
import {
  createSellerProduct,
  getSellerOrders,
  getSellerProducts,
  getSellerStats,
  updateSellerOrderStatus,
  updateSellerVariant
} from '../controllers/sellerController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('Seller'));

router.get('/products', getSellerProducts);
router.post('/products', createSellerProduct);
router.patch('/variants/:id', updateSellerVariant);
router.get('/orders', getSellerOrders);
router.patch('/orders/:id/status', updateSellerOrderStatus);
router.get('/stats', getSellerStats);

export default router;
