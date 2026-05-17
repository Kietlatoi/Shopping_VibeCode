import { sequelize } from './src/models/index.js';

async function check() {
  try {
    const results = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('Raw results:', results);
    if (results && results[0]) {
      console.log('Tables found:', results[0].map(r => r.table_name));
    } else {
      console.log('No tables found or unexpected result format.');
    }
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await sequelize.close();
  }
}

check();
