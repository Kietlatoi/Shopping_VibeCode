import express from 'express';
import { createOrder, getMyOrders, getOrderById, confirmDelivery } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/confirm-delivery', confirmDelivery);

export default router;
