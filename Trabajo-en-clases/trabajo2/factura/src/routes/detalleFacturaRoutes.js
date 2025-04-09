const express = require("express");
const router = express.Router();
const { 
  obtenerDetallesFactura,
  obtenerDetalleFacturaPorId,
  obtenerDetallesPorFactura,
  crearDetalleFactura,
  editarDetalleFactura,
  eliminarDetalleFactura
} = require("../controller/detalleFacturaController");

/**
 * @swagger
 * /detallesFactura:
 *   get:
 *     summary: Obtiene todos los detalles de facturas con soporte para paginación
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
 *     responses:
 *       200:
 *         description: Lista de detalles de facturas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de detalles de facturas encontrados
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
 *                       producto_id:
 *                         type: integer
 *                       cantidad:
 *                         type: integer
 *                       precio:
 *                         type: number
 *                         format: decimal
 *                       factura_id:
 *                         type: integer
 */
router.get("/", obtenerDetallesFactura);

/**
 * @swagger
 * /detallesFactura/{id}:
 *   get:
 *     summary: Obtiene un detalle de factura por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle de factura
 *     responses:
 *       200:
 *         description: Detalle de factura obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 producto_id:
 *                   type: integer
 *                 cantidad:
 *                   type: integer
 *                 precio:
 *                   type: number
 *                   format: decimal
 *                 factura_id:
 *                   type: integer
 *       404:
 *         description: Detalle de factura no encontrado
 */
router.get("/:id", obtenerDetalleFacturaPorId);

/**
 * @swagger
 * /detallesFactura/factura/{facturaId}:
 *   get:
 *     summary: Obtiene los detalles de una factura específica por su ID
 *     parameters:
 *       - in: path
 *         name: facturaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Detalles de factura obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   producto_id:
 *                     type: integer
 *                   cantidad:
 *                     type: integer
 *                   precio:
 *                     type: number
 *                     format: decimal
 *                   factura_id:
 *                     type: integer
 *       404:
 *         description: Factura no encontrada
 */
router.get("/factura/:facturaId", obtenerDetallesPorFactura);

/**
 * @swagger
 * /detallesFactura:
 *   post:
 *     summary: Crea un nuevo detalle de factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precio:
 *                 type: number
 *                 format: decimal
 *               factura_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Detalle de factura creado exitosamente
 */
router.post("/", crearDetalleFactura);

/**
 * @swagger
 * /detallesFactura/{id}:
 *   put:
 *     summary: Actualiza un detalle de factura existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle de factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precio:
 *                 type: number
 *                 format: decimal
 *               factura_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Detalle de factura actualizado exitosamente
 *       404:
 *         description: Detalle de factura no encontrado
 */
router.put("/:id", editarDetalleFactura);

/**
 * @swagger
 * /detallesFactura/{id}:
 *   delete:
 *     summary: Elimina un detalle de factura por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle de factura
 *     responses:
 *       200:
 *         description: Detalle de factura eliminado exitosamente
 *       404:
 *         description: Detalle de factura no encontrado
 */
router.delete("/:id", eliminarDetalleFactura);

module.exports = router;