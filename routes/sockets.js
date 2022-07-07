import logger from '../loggers/logger.js'  
// import ContenedorMemoria from "../contenedores/ContenedorMemoria"
// const contenedorMessages = new ContenedorMemoria("mensajes");
// logger.info(contenedorMessages.getMessages());

const listaProductos = [];
import productosFaker from '../contenedores/ContenedorFaker.js'
productosFaker.forEach(producto => listaProductos.push(producto))
logger.info(listaProductos);

export default (io, socket) => {
  logger.info(`WebSockets: Nuevo cliente conectado`);
  try {
    logger.info("¡Nuevo cliente conectado!");

    socket.emit("productoDesdeElServidor", listaProductos);
    // const mensajes = contenedorMessages.getMessages()
    logger.info(mensajes);
    // socket.emit('mensajeDesdeElServidor', mensajes)  
    
    socket.on("productoDesdeElCliente", (data) => {
      listaProductos.push({ socketid: socket.id, producto: data });
      io.sockets.emit("productoDesdeElServidor", listaProductos);
    });
    // socket.on("mensajeDesdeElCliente", (data) => {
    //   mensajes.push({ socketid: socket.id, mensaje: data });
    //   io.sockets.emit("mensajeDesdeElServidor", mensajes);
    // });
  } catch (error) {
    socket.emit("error", {
      error: error.message,
    });
  }
};
