const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistema de Ventas API",
      version: "1.0.0",
      description: "Documentación de mi API usando Swagger en Node.js",
    },
    servers: [
      {
        url: "http://localhost:3002",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Ruta a los archivos de rutas con documentación
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
