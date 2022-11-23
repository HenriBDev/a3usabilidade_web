import express from 'express'
import abrirBd from './src/js/connectDb.js'
const app = express()
const port = 8080

app.use(express.static('src'));
app.use(express.urlencoded({extended:false, limit: '50mb', parameterLimit: 1000000}));

app.listen(port, () => {
  console.log(`Server rodando na porta ${port}`)
})

app.post('/insereDados', (req, res) => {
    (async function(){
        let dados = JSON.parse(Object.keys(req.body)[0])
        let vendasImoveis = await abrirBd()
        await vendasImoveis.insertMany(dados)
    }())
})
