import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize.js';
import Product from './Product.js';

class ProductVariant extends Model {}

ProductVariant.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  attributes: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  sequelize,
  modelName: 'ProductVariant',
  tableName: 'product_variants',
  underscored: true
});

// Associations
ProductVariant.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'variants' });

export default ProductVariant;
