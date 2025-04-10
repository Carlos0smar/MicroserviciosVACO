const Libro = require('../models/Libro');

exports.getAllLibros = async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createLibro = async (req, res) => {
  const libro = new Libro({
    titulo: req.body.titulo,
    autor: req.body.autor,
    editorial: req.body.editorial,
    anio: req.body.anio,
    descripcion: req.body.descripcion,
    numero_pagina: req.body.numero_pagina,
  });

  try {
    const newLibro = await libro.save();
    res.status(201).json(newLibro);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateLibro = async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    if (req.body.titulo) libro.titulo = req.body.titulo;
    if (req.body.autor) libro.autor = req.body.autor;
    if (req.body.editorial) libro.editorial = req.body.editorial;
    if (req.body.anio) libro.anio = req.body.anio;
    if (req.body.descripcion) libro.descripcion = req.body.descripcion;
    if (req.body.numero_pagina) libro.numero_pagina = req.body.numero_pagina;

    const updatedLibro = await libro.save();
    res.json(updatedLibro);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteLibro = async (req, res) => {
  try {
    const libro = await Libro.findByIdAndDelete(req.params.id);
    if (!libro) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json({ message: 'Libro eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};