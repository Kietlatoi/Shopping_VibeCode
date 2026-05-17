import User from '../models/User.js';
import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import Role from '../models/Role.js';
import Dispute from '../models/Dispute.js';
import AuditLog from '../models/AuditLog.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Shop from '../models/Shop.js';

// Logger helper
const logAction = async (userId, action, metadata) => {
  try {
    await AuditLog.create({
      user_id: userId,
      action,
      metadata
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
};

export const approveProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.is_approved = is_approved;
    await product.save();

    await logAction(req.user.id, is_approved ? 'APPROVE_PRODUCT' : 'REJECT_PRODUCT', { product_id: id });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['password'] }
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active', 'banned'

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = status;
    await user.save();

    await logAction(req.user.id, 'UPDATE_USER_STATUS', { target_user_id: id, status });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.findAll({
      include: [
        {
          model: Order,
          as: 'order',
          include: [{ model: User, as: 'user', attributes: ['id', 'email'] }]
        },
        { model: User, as: 'admin', attributes: ['id', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });

    const enriched = disputes.map(d => {
      const json = d.toJSON();
      return {
        ...json,
        buyerEmail: json.order?.user?.email || 'N/A',
        sellerEmail: 'N/A', // would need shop lookup
        orderCode: `#${json.order_id?.slice(0, 8).toUpperCase() || ''}`,
      };
    });

    res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    next(error);
  }
};

export const updateDisputeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const dispute = await Dispute.findByPk(id);
    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute not found' });
    }

    dispute.status = status;
    dispute.admin_id = req.user.id;
    await dispute.save();

    await logAction(req.user.id, `UPDATE_DISPUTE_${status.toUpperCase()}`, { dispute_id: id, status });

    res.status(200).json({ success: true, data: dispute });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, pendingApprovals, pendingDisputes, totalOrders] = await Promise.all([
      User.count(),
      Product.count({ where: { is_approved: true } }),
      Product.count({ where: { is_approved: false } }),
      Dispute.count({ where: { status: 'pending' } }),
      Order.count(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        pendingApprovals,
        pendingDisputes,
        totalOrders,
        totalRevenue: 0, // would aggregate from orders
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.findAll({
      include: [{ model: User, as: 'user', attributes: ['email'] }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};
