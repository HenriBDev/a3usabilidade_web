import express from 'express'
import abrirBd from './src/js/connectDb.js'
const app = express()
const port = 8080
const vendasImoveis = await abrirBd()

app.use(express.static('src'));
app.use(express.urlencoded({extended:false, limit: '50mb', parameterLimit: 1000000}));

app.listen(port, () => {
  console.log(`Server rodando na porta ${port}`)
})

app.post('/inserirDados', (req, res) => {
    (async function(){
        let dados = JSON.parse(Object.keys(req.body)[0])
        await vendasImoveis.insertMany(dados)
        res.send('Success')
    }())
})

app.post('/atualizarDados', (req, res) => {
    (async function(){
        let dados = JSON.parse(Object.keys(req.body)[0])[0]
        await vendasImoveis.findOneAndUpdate({Logradouro: dados.Logradouro}, dados)
        res.send('Success')
    }())
})

app.post('/deletarDados', (req, res) => {
    (async function(){
        await vendasImoveis.findOneAndDelete({Logradouro: Object.keys(req.body)[0]})
        res.send('Success')
    }())
})

app.post('/lerDados', (req, res) => {
    (async function(){
        res.send(await vendasImoveis.find())
    }())
})
