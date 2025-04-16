require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Libro = require('./models/Libro')
const { graphqlHTTP } = require('express-graphql');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const LibroType = new GraphQLObjectType({
  name: 'Libro',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    titulo: { type: GraphQLNonNull(GraphQLString) },
    autor: { type: GraphQLNonNull(GraphQLString) },
    editorial: { type: GraphQLNonNull(GraphQLString) },
    anio: { type: GraphQLNonNull(GraphQLInt) },
    descripcion: { type: GraphQLNonNull(GraphQLString) },
    numero_pagina: { type: GraphQLNonNull(GraphQLInt) }
  })
});

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    libros: {
      type: GraphQLList(LibroType),
      resolve: async () => {
        return await Libro.find();
      }
    },
    libro: {
      type: LibroType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args) => {
        return await Libro.findById(args.id);
      }
    }
  }
});

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    agregarLibro: {
      type: LibroType,
      args: {
        titulo: { type: GraphQLNonNull(GraphQLString) },
        autor: { type: GraphQLNonNull(GraphQLString) },
        editorial: { type: GraphQLNonNull(GraphQLString) },
        anio: { type: GraphQLNonNull(GraphQLInt) },
        descripcion: { type: GraphQLNonNull(GraphQLString) },
        numero_pagina: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: async (parent, args) => {
        const libro = new Libro({
          titulo: args.titulo,
          autor: args.autor,
          editorial: args.editorial,
          anio: args.anio,
          descripcion: args.descripcion,
          numero_pagina: args.numero_pagina,
        });
        return await libro.save();
      }
    },
    actualizarLibro: {
      type: LibroType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        titulo: { type: GraphQLString },
        autor: { type: GraphQLString },
        editorial: { type: GraphQLString },
        anio: { type: GraphQLInt },
        descripcion: { type: GraphQLString },
        numero_pagina: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        return await Libro.findByIdAndUpdate(
          args.id,
          {
            titulo: args.titulo,
            autor: args.autor,
            editorial: args.editorial,
            anio: args.anio,
            descripcion: args.descripcion,
            numero_pagina: args.numero_pagina
          },
          { new: true }
        );
      }
    },
    eliminarLibro: {
      type: LibroType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve: async (parent, args) => {
        return await Libro.findByIdAndDelete(args.id);
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(4000, () => console.log('Servidor GraphQL en http://localhost:4000/graphql'));
