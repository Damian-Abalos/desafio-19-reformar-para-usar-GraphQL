import ProductoModel from '../../daos/models/Producto.model.js'
import DbClient from '../../daos/mongo/DbClient.js'
import logger from '../../loggers/logger.js'

export default class ProductosDaoMongo {
  constructor() {
    this.colecction = ProductoModel;
    this.conn = new DbClient();
  }

  async listarProductos() {
    let docs = []
    try {
      //            await this.conn.connect();
      docs = await this.colecction.find({})
      return docs
    } catch (error) {
      logger.error(`Error al listar Productos. ${error}`);
      throw new Error(`Error al listar Productos. ${error}`)
    } finally {
      //            this.conn.disconnect();
      logger.info(`Productos listados: ${docs.length}`);
    }
  }

  async listarProducto(id) {
    let doc;
    try {
      //            await this.conn.connect();
      doc = await this.colecction.find({
        _id: {$eq: id}
      })
      return doc;
    } catch (error) {
      logger.error(`Error al listar Producto con id: ${id}`);
      throw new Error(`Error al listar Producto con id: ${id}`)
    } finally {
      //            this.conn.disconnect();
      logger.info(`Elemento listado id: ${id}`);
    }
  }

  async saveProducto(obj) {
    try {
      //            await this.conn.connect();
      let doc = await this.colecction(obj);
      const save = await doc.save().then(res => res)
      return doc._id
    } catch (error) {
      const err = error
      logger.error(err);
      throw new Error;
    } finally {
      //            this.conn.disconnect();
      logger.info(`Elemento guardado ${obj}`);
    }

  }

  async updateProducto(id, elem) {
    try {
      const {
        title,
        precio,
        thumbnail
      } = elem;
      const newTimestamp = new Date()
      const timestamp = newTimestamp.toLocaleString()
      const modificado = await this.coleccion.updateOne({
        _id: id
      }, {
        $set: {
          timestamp: timestamp,
          title: title,
          precio: precio,
          thumbnail: thumbnail
        }
      })
      if (modificado.modifieCount === 0 || !modificado.modifieCount) {
        logger.error(`Error al actualizar id: ${id}`)
        throw new Error(`Error al actualizar id: ${id}`)
      } else return void (0)

    } catch (error) {
      throw error
    }
  }

  async deleteProducto(id) {
    try {
      const borrado = await this.coleccion.deleteOne({
        _id: {
          $eq: id
        }
      })
      if (borrado.modifieCount === 0) {
        logger.error(`Error en id: ${id}`)
        throw new Error(`en id: ${id}`)
      } else return void (0)
    } catch (error) {
      logger.error(`Error al borrar id: ${error}`)
      throw new Error(`Error al borrar id: ${error}`)
    }
  }
}