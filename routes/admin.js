const express = require('express')
const router = express.Router();
const mongoose =  require('mongoose');
require("../models/Categorias")
const Categoria = mongoose.model('Categorias');

//Rota principal
    router.get('/', (req, res) => {
        res.render("../views/admin/admin");
    });
//Rota posts
    router.get('/posts', (req, res) => {
        res.send("Pagina de posts");
    });
//Rota categorias
    router.get('/categorias', (req, res) => {
        res.render("admin/categorias");
    });
    router.get('/categorias/add', (req, res) => {
        res.render("admin/addcategorias");
    });
    router.post('/categorias/nova', (req, res) => {
        const novaCategoria = {
           nome: req.body.nome,
           slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            console.log("Categoria salva com sucesso")
        }).catch((erro) => {
            console.log(erro)
        }) 
    });
    


module.exports = router;