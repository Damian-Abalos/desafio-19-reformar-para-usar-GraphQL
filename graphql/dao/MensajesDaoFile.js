import fs from 'fs'

export default class MensajesDaoFile {
    constructor() {
        this.ruta = './DB/mensajes.json'
    }

    async listarMensajes() {
        try {
            const objs = await fs.readFile(this.ruta, 'utf-8')
            const todos = await JSON.parse(objs)
            return todos
        } catch (error) {
            throw new Error(error)
        }
    }

    async saveMensaje(obj) {
        const objs = await this.listarMensajes();
        objs.push(obj)
        try {
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
            return obj.id
        } catch (error) {
            throw new Error(error)
        }
    }

}