import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize.js';
import User from './User.js';

class Cart extends Model {}

Cart.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Cart',
  tableName: 'carts',
  underscored: true
});

// Associations
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });

export default Cart;
