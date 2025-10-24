import sequelize from './config/db.js';

async function testDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection established successfully!');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

testDB();
