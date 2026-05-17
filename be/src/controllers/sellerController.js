import { sequelize } from '../models/index.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';

const getOrCreateSellerShop = async (userId) => {
  const [shop] = await Shop.findOrCreate({
    where: { owner_id: userId },
    defaults: {
      owner_id: userId,
      name: 'Cửa hàng của tôi',
      rating_vibe: 5
    }
  });

  return shop;
};

export const getSellerProducts = async (req, res, next) => {
  try {
    const shop = await getOrCreateSellerShop(req.user.id);
    const products = await Product.findAll({
      where: { shop_id: shop.id },
      include: [{ model: ProductVariant, as: 'variants' }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const createSellerProduct = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const shop = await getOrCreateSellerShop(req.user.id);
    const product = await Product.create({
      shop_id: shop.id,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      image: req.body.thumbnail || req.body.image,
      is_approved: false
    }, { transaction });

    await ProductVariant.create({
      product_id: product.id,
      price: req.body.price || req.body.variants?.[0]?.price || 0,
      stock: req.body.stock || req.body.variants?.[0]?.stock || 0,
      attributes: req.body.attributes || req.body.variants?.[0]?.attributes || {}
    }, { transaction });

    await transaction.commit();

    const createdProduct = await Product.findByPk(product.id, {
      include: [{ model: ProductVariant, as: 'variants' }]
    });

    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

export const updateSellerVariant = async (req, res, next) => {
  try {
    const shop = await getOrCreateSellerShop(req.user.id);
    const variant = await ProductVariant.findOne({
      where: { id: req.params.id },
      include: [{ model: Product, as: 'product', where: { shop_id: shop.id } }]
    });

    if (!variant) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    await variant.update({
      price: req.body.price ?? variant.price,
      stock: req.body.stock ?? variant.stock
    });

    res.status(200).json({ success: true, data: variant });
  } catch (error) {
    next(error);
  }
};

export const getSellerOrders = async (req, res, next) => {
  try {
    const shop = await getOrCreateSellerShop(req.user.id);
    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'items',
        required: true,
        include: [{
          model: ProductVariant,
          as: 'variant',
          required: true,
          include: [{ model: Product, as: 'product', where: { shop_id: shop.id } }]
        }]
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateSellerOrderStatus = async (req, res, next) => {
  try {
    const shop = await getOrCreateSellerShop(req.user.id);
    const order = await Order.findOne({
      where: { id: req.params.id },
      include: [{
        model: OrderItem,
        as: 'items',
        required: true,
        include: [{
          model: ProductVariant,
          as: 'variant',
          required: true,
          include: [{ model: Product, as: 'product', where: { shop_id: shop.id } }]
        }]
      }]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await order.update({ status: req.body.status });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getSellerStats = async (req, res, next) => {
  try {
    const shop = await getOrCreateSellerShop(req.user.id);

    const products = await Product.findAll({
      where: { shop_id: shop.id },
      include: [{ model: ProductVariant, as: 'variants' }]
    });

    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'items',
        required: true,
        include: [{
          model: ProductVariant,
          as: 'variant',
          required: true,
          include: [{ model: Product, as: 'product', where: { shop_id: shop.id } }]
        }]
      }]
    });

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const lowStockItems = products.reduce((count, p) => {
      return count + (p.variants || []).filter(v => v.stock <= 20).length;
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        lowStockItems,
      }
    });
  } catch (error) {
    next(error);
  }
};
