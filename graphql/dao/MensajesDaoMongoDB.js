import MensajeModel from '../../daos/models/Mensaje.model.js'
import DBClient from '../../daos/mongo/DbClient.js'
import logger from '../../loggers/logger.js'

export default class MensajesDaoMongoDB {
    constructor() {
        this.colecction = MensajeModel;
        this.conn = new DBClient();
    }

    async listarMensajes() {
        let docs = []
        try {
            //            await this.conn.connect();
            docs = await this.colecction.find({})
            if (docs.length === 0) return null
            return docs
        } catch (error) {
            throw new Error(`Error al listar Mensajes. ${error}`);
        } finally {
            //            this.conn.disconnect();
            logger.info(`Mensajes listados ${docs.length}`);
        }
    }

    async saveMensaje(obj) {
        try {
            //  await this.conn.connect();
            mensaje = {
                author: obj.author,
                text: obj.text,
                date: obj.date
            }
            const doc = new this.colecction(mensaje)
            const save = await doc.save()
            return save._id
        } catch (error) {
            throw new Error(`Error al guardar mensaje. ${error}`);
        } finally {
            //            this.conn.disconnect();
            logger.info(`Elemento Mensaje guardado.`);
        }
    }

}