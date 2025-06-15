const { Sequelize } = require('sequelize');


const createDatabaseIfNotExists = async () => {
  const temporalSequelize = new Sequelize({
    host: process.env.DB_HOST || 'db-reservas',
    dialect: 'mysql',
    username: process.env.DB_USER || 'reservas_user',
    password: process.env.DB_PASSWORD || 'reservas_password',
    logging: console.log
  });

  try {
    await temporalSequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'reservas_db'};`);
    await temporalSequelize.close();
  } catch (error) {
    console.error('Error al crear la base de datos:', error);
    throw error;
  }
};

// const sequelize = new Sequelize(
//   process.env.DB_NAME || 'reservas_db',
//   process.env.DB_USER || 'reservas_user',
//   process.env.DB_PASSWORD || 'reservas_password' ,
//   {
//     host: process.env.DB_HOST || 'db-reservas',
//     dialect: 'mysql',
//     logging: console.log,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   }
// );

const sequelize = new Sequelize(
  process.env.DB_NAME || 'reservas_db',
  process.env.DB_USER || 'reservas_user',
  process.env.DB_PASSWORD || 'reservas_password' ,
  {
    host: process.env.DB_HOST || 'db-reservas',
    dialect: 'mysql'
  }
);

const initDatabase = async () => {
  try {
    
    await createDatabaseIfNotExists();
    
    
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    
    await sequelize.sync({ alter: true }); 
    console.log('Base de datos sincronizada: todas las tablas han sido creadas/actualizadas.');
    
    return true;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  initDatabase
};
