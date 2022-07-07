import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import ProductosApi from '../api/ProductosApi.js'
import MensajesApi from '../api/MensajesApi.js'

const schema = buildSchema(`
    # Defino los Inputs: Producto y Mensaje
      input ProductoInput {
        nombre: String,
        precio: Float,
        stock: Int,
        timestamp: String,
      }
    
      input AuthorInput{
        mail: String,
        nombre: String,
        apellido: String,
        edad: Int,
        alias: String,
        avatar: String 
      }
    
      input MensajeInput {
        author: AuthorInput,
        text: String,
        date: String
      }
    
    # Defino los types: Producto y Mensaje
      type Producto {
        id: ID!
        nombre: String,
        precio: Float,
        stock: Int,
      }

      type Author {
          mail: String,
          nombre: String,
          apellido: String,
          edad: Int,
          alias: String,
          avatar: String
      }
    
      type Mensaje {
          author: Author,
          id: ID!,
          text: String,
          date: String,
      }
    
    # Defino los type Query y Mutation
      type Query {
        listarProductos: [Producto],
        listarProducto(id: ID!): Producto,
        listarMensajes: [Mensaje]
      }
      type Mutation {
        nuevoProducto(datos: ProductoInput): Producto
        nuevoMensaje(datos: MensajeInput): Mensaje
        actualizarProducto(id: ID!, datos: ProductoInput): Producto,
        deleteProducto(id: ID!): [Producto],
      }
    `);

export default class GraphQLController {
    constructor() {
        const apiProductos = new ProductosApi()
        const apiMensajes = new MensajesApi()
        return graphqlHTTP({
            schema: schema,
            rootValue: {
                nuevoProducto: apiProductos.nuevoProducto,
                listarProductos: apiProductos.listarProductos,
                listarProducto: apiProductos.listarProducto,
                actualizarProducto: apiProductos.actualizarProducto,
                deleteProducto: apiProductos.deleteProducto,
                listarMensajes: apiMensajes.listarMensajes,
                nuevoMensaje: apiMensajes.nuevoMensaje
            },
            graphiql: true,
        })
    }
}