import config from '../../config.js'
import Producto from '../models/Productos.js'
import ProductosDaoMongo from '../dao/ProductosDaoMongoDB.js'
import ProductosDaoFile from '../dao/ProductosDaoFile.js'
import ProductosDaoMem from '../dao/ProductosDaoMem.js'

let ProductosDao
switch (config.srv.persistencia) {
    case 'mongodb':
        ProductosDao = ProductosDaoMongo
        break
    case 'file':
        ProductosDao = ProductosDaoFile
        break
    default:
        ProductosDao = ProductosDaoMem
        break
}


export default class ProductosApi {
    constructor() {
        this.dao = new ProductosDao()
    }

    listarProductos = () => {
        return this.dao.listarProductos()
    }

    listarProducto = ({
        id
    }) => {
        return this.dao.listarProducto(id)
    }

    nuevoProducto = async ({
        datos
    }) => {
        const objs = await this.dao.listarProductos();
        const productos = Object.values(objs)
        const id = productos.length + 1
        const nuevoProducto = new Producto(id, datos)
        this.dao.saveProducto(nuevoProducto)
        return nuevoProducto
    }

    actualizarProducto = ({
        id,
        datos
    }) => {
        const actualizado = this.dao.updateProducto(id, datos)
        return actualizado
    }

    deleteProducto = ({
        id
    }) => {
        const deleted = this.dao.deleteProducto(id)
        return deleted
    }

}