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
    },
    eAdmin:{
        type: Number,
        default: 0
    }
});

mongoose.model('Usuario', Usuario);