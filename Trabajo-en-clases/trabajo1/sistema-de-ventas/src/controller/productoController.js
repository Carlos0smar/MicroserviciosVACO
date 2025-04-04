const { getRepository } = require("typeorm");
const { Producto } = require("../entity/producto");

const obtenerProductos = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    
    const [productos, total] = await getRepository(Producto).findAndCount({
      where: search
        ? [
            { nombre: Like(`%${search}%`) },
            { descripcion: Like(`%${search}%`) },
            { marca: Like(`%${search}%`) },
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
      data: productos,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await getRepository(Producto).findOne({
      where: { id: req.params.id }
    });
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ mensaje: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener producto", error: error.message });
  }
};

const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, marca, stock } = req.body;
    if (!nombre || !descripcion || !marca || !stock) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
    const nuevoProducto = getRepository(Producto).create({
      nombre,
      descripcion,
      marca,
      stock,
    });
    const resultado = await getRepository(Producto).save(nuevoProducto);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear producto", error: error.message });
  }
};
const editarProducto = async (req, res) => {
  try {
    const { nombre, descripcion, marca, stock } = req.body;
    const producto = await getRepository(Producto).findOneBy({id: req.params.id});
    
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    
    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.marca = marca;
    producto.stock = stock;
    
    const resultado = await getRepository(Producto).save(producto);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar producto", error: error.message });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const resultado = await getRepository(Producto).delete(req.params.id);
    
    if (resultado.affected === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    
    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar producto", error: error.message });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  editarProducto,
  eliminarProducto,
};