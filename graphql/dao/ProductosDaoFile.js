import fs from 'fs'

export default class ProductosDao {
    constructor() {
        this.ruta = './DB/productos.json'
    }

    async listarProductos() {
        try {
            const objs = await fs.readFile(this.ruta, 'utf-8')
            const todos = await JSON.parse(objs)
            return todos
        } catch (error) {
            throw new Error(error)
        }
    }

    async listarProducto(id) {
        const objs = await this.listarProductos()
        const buscado = objs.find(o => o.id == id)
        return buscado
    }

    async saveProducto(obj) {
        const objs = await this.listarProductos();
        objs.push(obj)
        try {
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
            return obj.id
        } catch (error) {
            throw new Error(error)
        }
    }

    async updateProducto(id, elem) {
        const objs = await this.listarProductos()
        const index = objs.findIndex(o => o.id == id)
        if (index < 0) {
            throw new Error(`Error al actualizar: no se encontró el id ${id}`)
        } else {
            objs[index] = elem
            try {
                fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
            } catch (error) {
                throw new Error(`Error al actualizar: ${error}`)
            }
        }
    }

    async deleteProducto(id) {
        const objs = await this.listarProductos()
        const index = objs.findIndex(o => o.id == id)
        if (index == -1) {
            throw new Error(`Error al borrar: no se encontró el id ${id}`)
        }
        objs.splice(index, 1)
        try {
            fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }
}