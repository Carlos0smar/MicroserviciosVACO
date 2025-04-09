const { EntitySchema } = require("typeorm");

module.exports.Producto = new EntitySchema({
  name: "Producto",
  tableName: "productos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombre: {
      type: "varchar",
    },
    descripcion: {
      type: "varchar",
      unique: true,
    },
    marca: {
      type: "varchar",
    },
    stock: {
      type: "varchar",
    },
    
    
  },
  // relations: {
  //   detallesFactura: {
  //     type: "one-to-many",
  //     target: "DetalleFactura",
  //     inverseSide: "producto",
  //   },
  // },
});
