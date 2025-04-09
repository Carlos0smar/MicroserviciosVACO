const { EntitySchema } = require("typeorm");

module.exports.DetalleFactura = new EntitySchema({
  // (productos, cantidades, precios)
  name: "DetalleFactura",
  tableName: "detalle_facturas",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    producto_id: {
      type: "int",
    },
    cantidad: {
      type: "int",
    },
    precio: {
      type: "decimal",
    },
    factura_id: {
      type: "int",
    },
  },
  relations: {
    producto: {
      type: "many-to-one",
      target: "Producto",
      joinColumn: {
        name: "producto_id",
      },
      onDelete: "CASCADE",
    },
    factura: {
      type: "many-to-one",
      target: "Factura",
      joinColumn: {
        name: "factura_id",
      },
      onDelete: "CASCADE",
    },
  }
});
