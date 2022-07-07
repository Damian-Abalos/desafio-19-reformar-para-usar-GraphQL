import express from 'express'
import getDao from '../../daos/ProductosDaoFactory.js'
const apiProducts = express.Router()

apiProducts.get('/api/productos', async (req, res) => {
    res.send(await getDao().getAll())
})

apiProducts.get('/api/productos/:id', async (req, res) => {
    let id = req.params.id
    res.send(await getDao().getById(id))
})

apiProducts.post('/api/productos', async (req, res) => {
    let prod = req.body
    res.send(await getDao().save(prod))
})

apiProducts.delete('/api/productos/:id', async (req, res) => {
    let id = req.params.id
    res.send(await getDao().deleteById(id))
})



export default apiProducts