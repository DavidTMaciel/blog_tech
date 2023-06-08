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
        erros.push({texto: "Nome invalido"})
    }
    if(!req.body.email || req.body.email == null || req.body.email == undefined){
        erros.push({texto: "Email invalido"})
    }
    if(!req.body.senha || req.body.senha == null || req.body.senha == undefined || req.body.senha.length <= 7){
        erros.push({texto: "Senha invalida"})
    }
    if(req.body.senha2 !== req.body.senha){
        erros.push({texto: "As senhas não são iguais"})
    }
    if(erros.length > 0){
        
        res.render("usuarios/registro", {erros: erros})
    }
    else{
        const novoUsuario = {

            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha

        }
        new Usuario(novoUsuario).save().then(() => {
            req.flash("success_msg", "Usuario cadastrado com sucesso");
            res.redirect("/admin")

        }).catch((erros) =>{
            req.flash("error_msg", "Ocorreu um erro ao registar o usuario, por favor tente novamente");;
            res.redirect("usuarios/registro")

        });
        
    }
});

module.exports = router;
