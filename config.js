import 'dotenv/config'
export const PERSISTENCIA = 'MONGO'
export const MONGO_URL = process.env.URLDB

const config = {
    NODE_ENV: process.env.NODE_ENV,
    administrador: process.env.ADMINISTRADOR || 'false',
    mongodb: {
        connstr: process.env.MONGO_URL_LOCAL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        }
    },
    filedb: {
        pathdb: './DB'
    },
    srv: {
        port: process.env.PORT,
        logger: process.env.LOG || 'DEV',
        persistencia: process.env.PERSISTENCIA
    }

}

export default config