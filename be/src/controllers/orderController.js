import { sequelize } from '../models/index.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import ProductVariant from '../models/ProductVariant.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';

export const createOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { shipping_address, payment_method, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of items) {
      const variant = await ProductVariant.findByPk(item.variant_id, { transaction });

      if (!variant) {
        throw new Error(`Variant ${item.variant_id} not found`);
      }

      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for variant ${variant.id}`);
      }

      const itemPrice = parseFloat(variant.price) * item.quantity;
      totalPrice += itemPrice;

      orderItemsData.push({
        variant_id: variant.id,
        quantity: item.quantity,
        price_at_purchase: variant.price
      });

      // Update stock
      await variant.update({ stock: variant.stock - item.quantity }, { transaction });
    }

    // Create Order
    const order = await Order.create({
      user_id: req.user.id,
      total_price: totalPrice,
      shipping_address,
      payment_method,
      status: 'pending'
    }, { transaction });

    // Create Order Items
    await OrderItem.bulkCreate(
      orderItemsData.map(item => ({ ...item, order_id: order.id })),
      { transaction }
    );

    // Clear items from Cart
    const cart = await Cart.findOne({ where: { user_id: req.user.id }, transaction });
    if (cart) {
      const variantIds = items.map(i => i.variant_id);
      await CartItem.destroy({
        where: {
          cart_id: cart.id,
          variant_id: variantIds
        },
        transaction
      });
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: ProductVariant,
          as: 'variant',
          include: [{ model: Product, as: 'product' }]
        }]
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: ProductVariant,
          as: 'variant',
          include: [{ model: Product, as: 'product' }]
        }]
      }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const confirmDelivery = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'shipped') {
      return res.status(400).json({
        success: false,
        message: `Cannot confirm delivery for order with status "${order.status}". Order must be "shipped".`
      });
    }

    await order.update({ status: 'delivered' });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
