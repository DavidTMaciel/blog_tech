const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Categorias = new Schema({
    nome: {
        type: 'string',
        required: true
    },
    slug:{
        type: 'string',
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
});

mongoose.model('Categorias', Categorias);