export default class MensajesDaoMem {
    constructor() {
        this.mensajes = []
    }

    listarmensajes() {
        return this.mensajes;
    }

    guardarMensaje(mensaje) {
        this.mensajes.push(mensaje)
    }

}