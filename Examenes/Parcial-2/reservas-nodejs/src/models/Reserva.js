const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reserva = sequelize.define('reservas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  habitacion_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_reserva: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_entrada: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_salida: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estado_reserva: {
    type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  total_a_pagar: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Reserva;
