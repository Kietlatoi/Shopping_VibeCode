import { sequelize } from './src/models/index.js';

async function checkData() {
  try {
    const [results] = await sequelize.query(`
      SELECT 'roles' as tbl, count(*)::int as cnt FROM roles
      UNION ALL SELECT 'users', count(*)::int FROM users
      UNION ALL SELECT 'products', count(*)::int FROM products
      UNION ALL SELECT 'product_variants', count(*)::int FROM product_variants
      UNION ALL SELECT 'shops', count(*)::int FROM shops
      UNION ALL SELECT 'orders', count(*)::int FROM orders
      UNION ALL SELECT 'cart_items', count(*)::int FROM cart_items
      UNION ALL SELECT 'disputes', count(*)::int FROM disputes
      UNION ALL SELECT 'audit_logs', count(*)::int FROM audit_logs
    `);
    console.table(results);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await sequelize.close();
  }
}
checkData();
