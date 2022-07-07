export default class MensajesDaoMem {
    constructor() {
        this.mensajes = []
    }

    listarMensajes() {
        return this.mensajes;
    }

    saveMensaje(mensaje) {
        this.mensajes.push(mensaje)
    }

}