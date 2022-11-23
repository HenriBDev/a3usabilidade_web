import mongoose from 'mongoose'
import process from 'process'
import 'dotenv/config.js'

export default abrirBd

async function abrirBd() {
    const connectionParams={
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, connectionParams)
    const tabelaSchema = await new mongoose.Schema({
        Logradouro: {
            type: String
        },
        Bairro: {
            type: String
        },
        "Preço (R$)": {
            type: Number
        },
        Número: {
            type: Number
        },
        "Mínimo Área (m²)": {
            type: Number
        },
        "Máximo Área (m²)": {
            type: Number
        },
        "Mínimo Quartos": {
            type: Number
        },
        "Máximo Quartos": {
            type: Number
        },
        "Mínimo Banheiros": {
            type: Number
        },
        "Máximo Banheiros": {
            type: Number
        },
        "Mínimo Vagas": {
            type: Number
        },
        "Máximo Vagas": {
            type: Number
        }, 
    }, {collection: 'vendas_imoveis_sp'})
    return await mongoose.model('vendas_imoveis_sp', tabelaSchema)
}