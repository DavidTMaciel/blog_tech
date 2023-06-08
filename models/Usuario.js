const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome:{
        type: 'string',
        required: true,
    },
    email:{
        type: 'string',
        required: true,
    },
    senha:{
        type: 'string',
        required: true,
    }
});

mongoose.model('Usuario', Usuario);