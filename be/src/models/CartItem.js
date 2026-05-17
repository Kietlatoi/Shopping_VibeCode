import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize.js';
import Cart from './Cart.js';
import ProductVariant from './ProductVariant.js';

class CartItem extends Model {}

CartItem.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cart_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'carts',
      key: 'id'
    }
  },
  variant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'product_variants',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  }
}, {
  sequelize,
  modelName: 'CartItem',
  tableName: 'cart_items',
  underscored: true
});

// Associations
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });

CartItem.belongsTo(ProductVariant, { foreignKey: 'variant_id', as: 'variant' });
ProductVariant.hasMany(CartItem, { foreignKey: 'variant_id' });

export default CartItem;
