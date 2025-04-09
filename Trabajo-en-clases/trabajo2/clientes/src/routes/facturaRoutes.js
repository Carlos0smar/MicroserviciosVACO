const express = require("express");
const router = express.Router();
const { 
  obtenerFacturas,
  crearFactura,
  editarFactura,
  eliminarFactura,
  obtenerFacturaPorId,
} = require("../controller/facturaController");

/**
 * @swagger
 * /facturas:
 *   get:
 *     summary: Obtiene todas las facturas con soporte para paginación y filtrado
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
 *         description: Texto para filtrar facturas por el nombre o apellido del cliente
 *     responses:
 *       200:
 *         description: Lista de facturas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de facturas encontradas
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
 *                       fecha:
 *                         type: string
 *                       cliente_id:
 *                         type: integer
 *                       cliente:
 *                         type: object
 *                         properties:
 *                           nombres:
 *                             type: string
 *                           apellidos:
 *                             type: string
 */
router.get("/", obtenerFacturas);

/**
 * @swagger
 * /facturas/{id}:
 *   get:
 *     summary: Obtiene una factura por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 fecha:
 *                   type: string
 *                 cliente_id:
 *                   type: integer
 *       404:
 *         description: Factura no encontrada
 */
router.get("/:id", obtenerFacturaPorId);

/**
 * @swagger
 * /facturas:
 *   post:
 *     summary: Crea una nueva factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *               cliente_id:
 *                 type: integer
 *               detalles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     precio:
 *                       type: number
 *                       format: decimal
 *     responses:
 *       201:
 *         description: Factura creada exitosamente
 */
router.post("/", crearFactura);

/**
 * @swagger
 * /facturas/{id}:
 *   put:
 *     summary: Actualiza una factura existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *               cliente_id:
 *                 type: integer
 *               detalles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     precio:
 *                       type: number
 *                       format: decimal
 *     responses:
 *       200:
 *         description: Factura actualizada exitosamente
 *       404:
 *         description: Factura no encontrada
 */
router.put("/:id", editarFactura);

/**
 * @swagger
 * /facturas/{id}:
 *   delete:
 *     summary: Elimina una factura por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura eliminada exitosamente
 *       404:
 *         description: Factura no encontrada
 */
router.delete("/:id", eliminarFactura);

module.exports = router;