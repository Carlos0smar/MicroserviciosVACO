require('dotenv').config();
const express = require("express");
const connectDB = require("./database");
const swaggerDocs = require("./swagger");
const path = require("path");
const clienteRoutes = require("./routes/clienteRoutes");
const productoRoutes = require("./routes/productoRoutes");
const detalleFacturaRoutes = require("./routes/detalleFacturaRoutes");
const facturaRoutes = require("./routes/facturaRoutes");



const app = express();

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


swaggerDocs(app);

// Rutas
app.use("/productos", productoRoutes);
app.use("/facturas", facturaRoutes);
app.use("/detalle-facturas", detalleFacturaRoutes);
app.use("/clientes", clienteRoutes);
app.use("/", (req, res) => {
  res.send("Bienvenido a la página principal!!");
  
});

const PORT = process.env.PORT || 3000;


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
  });
});
