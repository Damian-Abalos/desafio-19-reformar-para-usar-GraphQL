import express from 'express'
import session from 'express-session'
import handlebars from 'express-handlebars'
import { createServer } from "http";
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cluster from 'cluster'
import minimist from 'minimist'
import passport from 'passport'
import compression from 'compression'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import { cpus } from 'os'
const numCPUs = cpus().length
import logger from './loggers/logger.js'
import { MONGO_URL } from './config.js'
import GraphQLController from './graphql/controllers/GraphQLController.js'

/*-------------[argumentos]-------------*/
const options = {
  alias: {
    p: "port",
    m: "modo",
  },
  default: {
    port: "8080",
    modo: "FORK",
  },
};
const args = minimist(process.argv.slice(2), options);
const port = parseInt(args.port) || 8080;
const modo = args.modo.toUpperCase();
console.log(modo);
/*---------------[App]----------------*/
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("./public"));
app.use('/graphql', new GraphQLController());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
    }),
    secret: "shh",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 600000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  logger.info(`Ruta: ${req.path}, Método: ${req.method}`);
  next();
});
import apiProducts from './routes/api/productos.js'
app.use("", apiProducts)
/*------------- [Sockets]-------------*/
import webSocket from './routes/sockets.js'
const onConnection = (socket) => {
  webSocket(io, socket);
};
io.on("connection", onConnection);
/*-----[Motor de plantillas - HBS]-----*/
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);
app.set("views", "./views");
app.set("view engine", "hbs");
/*------------- [Public]-------------*/
app.use("/static", express.static("public"));
/*------------- [Rutas]-------------*/
import autentication from './routes/autentication.js' 
import infoYrandoms from './routes/info&randoms.js'
app.use("", autentication);
app.use("", infoYrandoms);

/*---------------- [Server] ---------------*/
if (modo === "CLUSTER") {
  //modo CLUSTER
  if (cluster.isMaster) {
    console.log(`Número de CPU: ${numCPUs}`);
    console.log(`PID MASTER ${process.pid}`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker) => {
      console.log(
        "Worker",
        worker.process.pid,
        "died",
        new Date().toLocaleString()
      );
      cluster.fork();
    });
  } else {
    const connectedServer = httpServer.listen(port, function () {
      console.log(
        `Servidor HTTP con Websockets escuchando en el puerto ${
          connectedServer.address().port
        }, modo: ${modo} - PID: ${process.pid}`
      );
    });
    connectedServer.on("error", (error) =>
      console.log(`Error en servidor: ${error}`)
    );
  }
} else {
  //modo FORK por defecto
  const connectedServer = httpServer.listen(port, function () {
    console.log(
      `Servidor HTTP con Websockets escuchando en el puerto ${
        connectedServer.address().port
      }, modo: ${modo} - PID: ${process.pid}`
    );
  });
  connectedServer.on("error", (error) =>
    console.log(`Error en servidor: ${error}`)
  );
  process.on("exit", (code) => {
    console.log("Exit code -> ", code);
  });
}