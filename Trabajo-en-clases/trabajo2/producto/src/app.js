require('dotenv').config();
const express = require("express");
const connectDB = require("./database");
const swaggerDocs = require("./swagger");
const path = require("path");
const productoRoutes = require("./routes/productoRoutes");


const app = express();

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


swaggerDocs(app);

// Rutas
app.use("/productos", productoRoutes);
app.use("/", (req, res) => {
  res.send("Bienvenido a la página principal!!");
  
});

const PORT = process.env.PORT || 3002;


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
  });
});
