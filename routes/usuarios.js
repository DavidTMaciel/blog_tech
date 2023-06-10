const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Usuario")
const Usuario = mongoose.model('Usuario');
const bcrypt = require('bcryptjs');


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
        
        res.render("/usuarios/registro", {erros: erros})
    }
    else{

        Usuario.findOne({email: req.body.email}).lean().then((usuario)=>{
            if(usuario){
                req.flash("error_msg", "Já existe uma conta com esse email");
                res.redirect("/usuarios/registro");
            }else{
                const novoUsuario =  new Usuario({

                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
        
                })
                //Criptografando a senha
                bcrypt.genSalt(10, (erro, salt) =>{
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) =>{
                        if(erro){
                            req.flash('error_msg',"Houve um erro durante o salvamento do usuario")
                            res.redirect('/');
                        }else{
                            novoUsuario.senha = hash;
                            novoUsuario.save().then(()=>{

                                req.flash("success_msg", "Usuario cadastrado com sucesso");
                                res.redirect("/")
                    
                            }).catch((erro) =>{
                                req.flash("error_msg", "Ocorreu um erro ao registar o usuario, por favor tente novamente");;
                                res.redirect("usuarios/registro")
                        });
                    }});
                });
            }
        }).catch((error)=>{
            req.flash("error_msg", "Houve um erro interno");
        });



        
    }
});

    //Login

    router.get('/login', (req, res) =>{
        res.render('usuarios/login');
    });

    

module.exports = router;

