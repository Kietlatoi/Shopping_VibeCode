import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize.js';
import User from './User.js';

class AuditLog extends Model {}

AuditLog.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  sequelize,
  modelName: 'AuditLog',
  tableName: 'audit_logs',
  underscored: true,
  updatedAt: false
});

AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default AuditLog;
