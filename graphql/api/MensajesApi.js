import config from '../../config.js'
import Mensaje from '../models/Mensajes.js'
import MensajesDaoMongo from '../dao/MensajesDaoMongoDB.js'
import MensajesDaoFile from '../dao/MensajesDaoFile.js'
import MensajesDaoMem from '../dao/MensajesDaoMem.js'

let MensajesDao
switch (config.srv.persistencia) {
    case 'mongodb':
        MensajesDao = MensajesDaoMongo
        break
    case 'file':
        MensajesDao = MensajesDaoFile
        break
    default:
        MensajesDao = MensajesDaoMem
        break
}

export default class MensajesApi {
    constructor() {
        this.dao = new MensajesDao()
    }

    listarMensajes = () => {
        return this.dao.listarMensajes()
    }

    nuevoMensaje = async ({
        datos
    }) => {
        const objs = await this.dao.listarMensajes();
        const mensajes = Object.values(objs)
        let id = mensajes.length + 1
        const nuevoMensaje = new Mensaje(id, datos)
        this.dao.saveMensaje(nuevoMensaje)
        return nuevoMensaje
    }

}