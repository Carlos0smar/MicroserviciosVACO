const { getRepository } = require("typeorm");
const { Factura } = require("../entity/factura");
const { Cliente } = require("../entity/cliente");

const obtenerFacturas = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    
    const [facturas, total] = await getRepository(Factura).findAndCount({
      relations: ["cliente"],
      where: search
        ? [
            { cliente: { nombres: Like(`%${search}%`) } },
            { cliente: { apellidos: Like(`%${search}%`) } },
          ]
        : undefined,
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });
    
    res.json({
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      data: facturas,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener facturas", error: error.message });
  }
};

const crearFactura = async (req, res) => {
  try {
    const { fecha, cliente_id } = req.body;

    if (!fecha || !cliente_id) {
      return res.status(400).json({ mensaje: "Fecha y cliente_id son obligatorios" });
    }

    const cliente = await getRepository(Cliente).findOne(
      {where: {id: cliente_id}});
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    const nuevaFactura = getRepository(Factura).create({
      fecha,
      cliente_id,
    });

    const resultado = await getRepository(Factura).save(nuevaFactura);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear factura", error: error.message });
  }
};

const editarFactura = async (req, res) => {
  const { fecha, cliente_id } = req.body;
  const factura = await getRepository(Factura).findOne({where: {id: req.params.id}});
  
  if (!factura) {
    return res.status(404).json({ mensaje: "Factura no encontrada" });
  }
    
  if (cliente_id) {
    const cliente = await getRepository(Cliente).findOne(cliente_id);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
  }
  
  factura.fecha = fecha;
  factura.cliente_id = cliente_id;
  
  const resultado = await getRepository(Factura).save(factura);
  res.json(resultado);
};

const eliminarFactura = async (req, res) => {
  const resultado = await getRepository(Factura).delete(req.params.id);
  res.json(resultado);
};

const obtenerFacturaPorId = async (req, res) => {
  const factura = await getRepository(Factura).findOne(
    {where: {id: req.params.id},
    relations: ["cliente"]
  });
  
  if (factura) {
    res.json(factura);
  } else {
    res.status(404).json({ mensaje: "Factura no encontrada" });
  }
};

module.exports = {
  obtenerFacturas,
  crearFactura,
  editarFactura,
  eliminarFactura,
  obtenerFacturaPorId
};