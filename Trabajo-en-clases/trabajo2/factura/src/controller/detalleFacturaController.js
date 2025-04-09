const { getRepository } = require("typeorm");
const { DetalleFactura } = require("../entity/detalleFactura");
const { Factura } = require("../entity/factura");
const { Producto } = require("../entity/producto");

const obtenerDetallesFactura = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;


    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);


    const [detalles, total] = await getRepository(DetalleFactura).findAndCount({
      relations: ["factura", "producto"],
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });


    res.json({
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      data: detalles,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener detalles de factura", error: error.message });
  }
};

const crearDetalleFactura = async (req, res) => {
  try {
    const { producto_id, cantidad, precio, factura_id } = req.body;

    if (!producto_id || !cantidad || !precio || !factura_id) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
    if (cantidad <= 0 || precio <= 0) {
      return res.status(400).json({ mensaje: "Cantidad y precio deben ser mayores a 0" });
    }

    const factura = await getRepository(Factura).findOne({where: {id: factura_id}});
    if (!factura) {
      return res.status(404).json({ mensaje: "Factura no encontrada" });
    }

    const producto = await getRepository(Producto).findOne({where: {id:producto_id}});
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const nuevoDetalle = getRepository(DetalleFactura).create({
      producto_id,
      cantidad,
      precio,
      factura_id,
    });

    const resultado = await getRepository(DetalleFactura).save(nuevoDetalle);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear detalle de factura", error: error.message });
  }
};

const editarDetalleFactura = async (req, res) => {
  const { producto_id, cantidad, precio, factura_id } = req.body;
  const detalle = await getRepository(DetalleFactura).findOne({
    where: {id: req.params.id}
  });
  
  if (!detalle) {
    return res.status(404).json({ mensaje: "Detalle de factura no encontrado" });
  }
  

  if (factura_id) {
    const factura = await getRepository(Factura).findOne(
      {where: {id: factura_id}});
    if (!factura) {
      return res.status(404).json({ mensaje: "Factura no encontrada" });
    }
  }
  

  if (producto_id) {
    const producto = await getRepository(Producto).findOne({where: {id: producto_id}});
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
  }
  
  detalle.producto_id = producto_id || detalle.producto_id;
  detalle.cantidad = cantidad || detalle.cantidad;
  detalle.precio = precio || detalle.precio;
  detalle.factura_id = factura_id || detalle.factura_id;
  
  const resultado = await getRepository(DetalleFactura).save(detalle);
  res.json(resultado);
};

const eliminarDetalleFactura = async (req, res) => {
  const resultado = await getRepository(DetalleFactura).delete(req.params.id);
  res.json(resultado);
};

const obtenerDetalleFacturaPorId = async (req, res) => {
  const detalle = await getRepository(DetalleFactura).findOne({
    where:{id: req.params.id}, 
    relations: ["factura", "producto"]
  });
  
  if (detalle) {
    res.json(detalle);
  } else {
    res.status(404).json({ mensaje: "Detalle de factura no encontrado" });
  }
};

const obtenerDetallesPorFactura = async (req, res) => {
  const factura_id = req.params.facturaId;
  

  const factura = await getRepository(Factura).findOne(factura_id);
  if (!factura) {
    return res.status(404).json({ mensaje: "Factura no encontrada" });
  }
  
  const detalles = await getRepository(DetalleFactura).find({
    where: { factura_id },
    relations: ["producto"]
  });
  
  res.json(detalles);
};

module.exports = {
  obtenerDetallesFactura,
  crearDetalleFactura,
  editarDetalleFactura,
  eliminarDetalleFactura,
  obtenerDetalleFacturaPorId,
  obtenerDetallesPorFactura
};