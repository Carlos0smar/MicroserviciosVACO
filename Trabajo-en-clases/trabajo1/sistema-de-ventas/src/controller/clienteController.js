const { getRepository } = require("typeorm");
const { Cliente } = require("../entity/cliente");

const obtenerClientes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    
    const [clientes, total] = await getRepository(Cliente).findAndCount({
      where: search
        ? [
            { nombres: Like(`%${search}%`) },
            { apellidos: Like(`%${search}%`) },
            { ci: Like(`%${search}%`) },
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
      data: clientes,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener clientes", error: error.message });
  }
};

const crearCliente = async (req, res) => {
  const { nombres, apellidos, ci, sexo } = req.body;
  const nuevoCliente = getRepository(Cliente).create({
    nombres,
    apellidos,
    ci,
    sexo
  });
  const resultado = await getRepository(Cliente).save(nuevoCliente);
  res.json(resultado);
};

const editarCliente = async (req, res) => {
  const { nombres, apellidos, ci, sexo } = req.body;
  const cliente = await getRepository(Cliente).findOneBy({id: req.params.id});
  if (cliente) {
    cliente.nombres = nombres;
    cliente.apellidos = apellidos;
    cliente.ci = ci;
    cliente.sexo = sexo;
    const resultado = await getRepository(Cliente).save(cliente);
    res.json(resultado);
  } else {
    res.status(404).json({ mensaje: "Cliente no encontrado" });
  }
};

const eliminarCliente = async (req, res) => {
  try {
    const cliente = await getRepository(Cliente).findOne({
      where: {id: req.params.id}
    });
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    const resultado = await getRepository(Cliente).delete(req.params.id);
    res.json({ mensaje: "Cliente eliminado", resultado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar cliente", error: error.message });
  }
};

const obtenerFacturasPorCliente = async (req, res) => {
  try {
    const cliente = await getRepository(Cliente).findOne({
      where:{ id: req.params.id }
    });
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    const facturas = await getRepository(Factura).find({
      where: { cliente_id: cliente.id },
      relations: ["cliente"]
    });
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener facturas", error: error.message });
  }
};

const obtenerClientePorId = async (req, res) => {
  const cliente = await getRepository(Cliente).findOne({
    where:{ id: req.params.id }
  });
  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ mensaje: "Cliente no encontrado" });
  }
};

module.exports = {
  obtenerClientes,
  crearCliente,
  editarCliente,
  eliminarCliente,
  obtenerClientePorId,
  obtenerFacturasPorCliente
};