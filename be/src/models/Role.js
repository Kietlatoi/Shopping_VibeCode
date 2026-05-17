import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize.js';

class Role extends Model {}

Role.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  permissions: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  sequelize,
  modelName: 'Role',
  tableName: 'roles',
  underscored: true
});

export default Role;
