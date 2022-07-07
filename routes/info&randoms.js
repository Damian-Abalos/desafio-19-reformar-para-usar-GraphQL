import express from 'express'
import compression from 'compression'
const infoYrandoms = express.Router()

infoYrandoms.get('/info', (req, res) => {
   res.render('info', {
      argumentos: process.argv,
      directorio: process.cwd(),
      idProceso: process.pid,
      versionNode: process.version,
      sistemaOperativo: process.platform,
      memoria: process.memoryUsage().heapTotal,
      path: process.execPath
   })
})

infoYrandoms.get('/info-log', (req, res) => {
   const info = {
       argumentos: args,
       directorio: process.cwd(),
       idProceso: process.pid,
       versionNode: process.version,
       sistemaOperativo: process.platform,
       memoria: process.memoryUsage().heapTotal,
       path: process.execPath,
       numProcesadores: numCPUs
   }
   console.log(info)

   res.render('info', {
       argumentos: args,
       directorio: process.cwd(),
       idProceso: process.pid,
       versionNode: process.version,
       sistemaOperativo: process.platform,
       memoria: process.memoryUsage().heapTotal,
       path: process.execPath,
       numProcesadores: numCPUs
   })
})

infoYrandoms.get('/infoZip', compression(), (req, res) => {
   res.render('info', {
       argumentos: args,
       directorio: process.cwd(),
       idProceso: process.pid,
       versionNode: process.version,
       sistemaOperativo: process.platform,
       memoria: process.memoryUsage().heapTotal,
       path: process.execPath,
       numProcesadores: numCPUs
   })
})

infoYrandoms.get('/api/randoms', (req, res) => {
   let cant = req.query.cant
   if (!cant) cant = 100000000
})

export default infoYrandoms