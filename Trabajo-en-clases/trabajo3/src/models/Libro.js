const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  autor: {
    type: String,
    required: true,
    trim: true
  },
  editorial: {
    type: String,
    trim: true
  },
  anio: {
    type: Number,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  numero_pagina: {
    type: Number,
    trim: true
  }
});

module.exports = mongoose.model('Libro', libroSchema);