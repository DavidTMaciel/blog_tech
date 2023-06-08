const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Usuario")
const Usuario = mongoose.model('Usuario');


//Rota registro
router.get('/registro', (req, res) => {
    res.render('usuarios/registro')
})
//Rota criando usuario

router.post('/registro/novo', (req, res) => {
    
    let erros =[]

    //Validação

    if(!req.body.nome || req.body.nome == null || req.body.nome == undefined){
        erros.push({Nome: "Nome invalido"})
    }
    if(!req.body.email || req.body.email == null || req.body.email == undefined){
        erros.push({Nome: "Email invalido"})
    }
    if(!req.body.senha || req.body.senha == null || req.body.senha == undefined || req.body.senha <= 7){
        erros.push({Nome: "Senha invalida"})
    }
    else{
        
    }
});

module.exports = router;
