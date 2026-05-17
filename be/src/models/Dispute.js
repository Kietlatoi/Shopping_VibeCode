import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize.js';
import Order from './Order.js';
import User from './User.js';

class Dispute extends Model {}

Dispute.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  admin_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'investigating', 'resolved', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  sequelize,
  modelName: 'Dispute',
  tableName: 'disputes',
  underscored: true
});

Dispute.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
Dispute.belongsTo(User, { foreignKey: 'admin_id', as: 'admin' });

export default Dispute;
