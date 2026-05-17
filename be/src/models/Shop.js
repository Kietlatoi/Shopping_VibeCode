import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize.js';
import User from './User.js';

class Shop extends Model {}

Shop.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rating_vibe: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 5.00
  }
}, {
  sequelize,
  modelName: 'Shop',
  tableName: 'shops',
  underscored: true
});

// Associations
Shop.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.hasOne(Shop, { foreignKey: 'owner_id', as: 'shop' });

export default Shop;
