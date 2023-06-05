const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Postagens = new Schema({
    titulo:{
        type: 'string',
        required: true,
    },
    slug:{
        type: 'string',
        required: true,
    },
    descricao:{
        type: 'string',
        required: true,
    },
    conteudo:{
        type: 'string',
        require: true,
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categorias',
        required: true,
    },
    data:{
        type:Date,
        default: Date.now()
    }


});

mongoose.model('Postagens', Postagens);