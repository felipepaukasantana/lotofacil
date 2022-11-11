const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@34.227.159.20:27017/lotofacil?authSource=admin');

const concursochema = new mongoose.Schema({
    id: Number,
    data: String,
    listaDezenas: [],
    acertos: [
        {
            aposta: String,
            quantidade: Number,
            numeros: [],
            premiada: Boolean,
            valorPremio: Number
        }
    ]
}, { collection: 'concursos' }
);

module.exports = { Mongoose: mongoose, ConcursoSchema: concursochema }