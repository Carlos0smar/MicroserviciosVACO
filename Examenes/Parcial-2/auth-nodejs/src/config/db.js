const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('MySQL conectado');
  } catch (err) {
    console.error('Error de conexión a MySQL:', err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };