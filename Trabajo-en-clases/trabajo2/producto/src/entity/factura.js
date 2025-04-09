const { EntitySchema } = require("typeorm");

module.exports.Factura = new EntitySchema({

  name: "Factura",
  tableName: "facturas",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    fecha: {
      type: "varchar",
    },
    cliente_id: {
      type: "int",
    },
  },
  relations: {
    cliente: {
      type: "many-to-one",
      target: "Cliente",
      joinColumn: {
        name: "cliente_id",
      },
      onDelete: "CASCADE",
    },
    detalleFactura: {
      type: "one-to-many",
      target: "DetalleFactura",
      inverseSide: "factura",
    },
  },
});
