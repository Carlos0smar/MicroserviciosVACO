const { EntitySchema } = require("typeorm");

module.exports.Cliente = new EntitySchema({

  name: "Cliente",
  tableName: "clientes",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombres: {
      type: "varchar",
    },
    apellidos: {
      type: "varchar",
    },
    ci: {
      type: "varchar",
      unique: true,
    },
    sexo: {
      type: "varchar",
    },
  },
  relations: {
    facturas: {
      type: "one-to-many",
      target: "Factura",
      inverseSide: "cliente",
    },
  },
});
