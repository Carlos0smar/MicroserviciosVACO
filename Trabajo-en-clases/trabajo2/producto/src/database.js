const { createConnection } = require("typeorm");
const { Producto } = require("./entity/producto");
const { DetalleFactura } = require("./entity/detalleFactura");
const { Factura } = require("./entity/factura");
const { Cliente } = require("./entity/cliente");
const connectDB = async () => {
  try {
    await createConnection({
      type: "mysql",
      host: process.env.DB_HOST, 
      port: 3306, // Puerto de MySQL (por defecto)
      username: process.env.DB_USER || "root", // Usuario de MySQL
      password: process.env.DB_PASS || "", // Contraseña de MySQL	
      database: process.env.DB_NAME || "db_sistema_ventas_microservices", //Base de datos
      entities: [Producto, DetalleFactura, Factura, Cliente],
      synchronize: true, // Solo para desarrollo (crea automáticamente las tablas)
    });
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
