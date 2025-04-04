const express = require("express");
const router = express.Router();
const { 
  obtenerClientes, 
  crearCliente, 
  editarCliente, 
  eliminarCliente, 
  obtenerClientePorId,
  obtenerFacturasPorCliente
} = require("../controller/clienteController");

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtiene todos los clientes con soporte para paginación y filtrado
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de la página (por defecto 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página (por defecto 10)
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Texto para filtrar clientes por nombre, apellido o CI
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de clientes encontrados
 *                 page:
 *                   type: integer
 *                   description: Página actual
 *                 limit:
 *                   type: integer
 *                   description: Límite de resultados por página
 *                 totalPages:
 *                   type: integer
 *                   description: Número total de páginas
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombres:
 *                         type: string
 *                       apellidos:
 *                         type: string
 *                       ci:
 *                         type: string
 *                       sexo:
 *                         type: string
 */
router.get("/", obtenerClientes);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtiene un cliente por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombres:
 *                   type: string
 *                 apellidos:
 *                   type: string
 *                 ci:
 *                   type: string
 *                 sexo:
 *                   type: string
 *       404:
 *         description: Cliente no encontrado
 */
router.get("/:id", obtenerClientePorId);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crea un nuevo cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               ci:
 *                 type: string
 *               sexo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 */
router.post("/", crearCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Actualiza un cliente existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               ci:
 *                 type: string
 *               sexo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *       404:
 *         description: Cliente no encontrado
 */
router.put("/:id", editarCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Elimina un cliente por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *       404:
 *         description: Cliente no encontrado
 */
router.delete("/:id", eliminarCliente);

module.exports = router;