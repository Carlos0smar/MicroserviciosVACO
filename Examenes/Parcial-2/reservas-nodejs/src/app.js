require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { initDatabase } = require('./config/database');
const Reserva = require('./models/Reserva');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLID,
  GraphQLFloat,
  GraphQLEnumType
} = require('graphql');


const ReservaType = new GraphQLObjectType({
  name: 'Reserva',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    habitacion_id: { type: GraphQLNonNull(GraphQLInt) },
    usuario_id: { type: GraphQLNonNull(GraphQLInt) },
    fecha_reserva: { type: GraphQLNonNull(GraphQLString) },
    fecha_entrada: { type: GraphQLNonNull(GraphQLString) },
    fecha_salida: { type: GraphQLNonNull(GraphQLString) },
    estado_reserva: { type: GraphQLNonNull(GraphQLString) },
    total_a_pagar: { type: GraphQLNonNull(GraphQLFloat) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
});

const EstadoReservaEnum = new GraphQLEnumType({
  name: 'EstadoReserva',
  values: {
    PENDIENTE: { value: 'pendiente' },
    CONFIRMADA: { value: 'confirmada' },
    CANCELADA: { value: 'cancelada' },
    COMPLETADA: { value: 'completada' }
  }
});


const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    reservas: {
      type: GraphQLList(ReservaType),
      resolve: async () => {
        return await Reserva.findAll();
      }
    },
    reserva: {
      type: ReservaType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args) => {
        return await Reserva.findByPk(args.id);
      }
    }
  }
});


const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    crearReserva: {
      type: ReservaType,
      args: {
        habitacion_id: { type: GraphQLNonNull(GraphQLInt) },
        usuario_id: { type: GraphQLNonNull(GraphQLInt) },
        fecha_entrada: { type: GraphQLNonNull(GraphQLString) },
        fecha_salida: { type: GraphQLNonNull(GraphQLString) },
        total_a_pagar: { type: GraphQLNonNull(GraphQLFloat) }
      },
      resolve: async (parent, args) => {
        return await Reserva.create({
          ...args,
          estado_reserva: 'pendiente'
        });
      }
    },
    actualizarReserva: {
      type: ReservaType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        estado_reserva: { type: EstadoReservaEnum },
        fecha_entrada: { type: GraphQLString },
        fecha_salida: { type: GraphQLString },
        total_a_pagar: { type: GraphQLFloat }
      },
      resolve: async (parent, args) => {
        const { id, ...updateData } = args;
        return await Reserva.update(updateData, {
          where: { id },
          returning: true
        }).then(() => Reserva.findByPk(id));
      }
    },
    eliminarReserva: {
      type: ReservaType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve: async (parent, args) => {
        const reserva = await Reserva.findByPk(args.id);
        await Reserva.destroy({ where: { id: args.id } });
        return reserva;
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

const app = express();


const startServer = async () => {
  try {

    const dbInitialized = await initDatabase();
    if (!dbInitialized) {
      throw new Error('No se pudo inicializar la base de datos');
    }


    app.use('/graphql/reservas', graphqlHTTP({
      schema: schema,
      graphiql: true
    }));


    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Servidor GraphQL iniciado en http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};


startServer();
