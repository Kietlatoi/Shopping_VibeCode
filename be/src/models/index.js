import { sequelize, Sequelize } from './sequelize.js';

import Role from './Role.js';
import User from './User.js';
import Shop from './Shop.js';
import Product from './Product.js';
import ProductVariant from './ProductVariant.js';
import Cart from './Cart.js';
import CartItem from './CartItem.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Dispute from './Dispute.js';
import AuditLog from './AuditLog.js';

const db = {
  sequelize,
  Sequelize,
  Role,
  User,
  Shop,
  Product,
  ProductVariant,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Dispute,
  AuditLog
};

export default db;
export {
  sequelize,
  Sequelize,
  Role,
  User,
  Shop,
  Product,
  ProductVariant,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Dispute,
  AuditLog
};


