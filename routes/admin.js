const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
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
        Categoria.find().lean().then((categorias) => {
            res.render("admin/categorias", {categorias: categorias});
        }).catch((erro) => {
            req.flash('error_msg', "Houve um erro ao registrar as categorias.");
            res.redirect("/admin");
        });
        
    });
    router.get('/categorias/add', (req, res) => {
        res.render("admin/addcategorias");
    });
    router.post('/categorias/nova', (req, res) => {

    let erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ text: "Nome invalido" });
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ text: "Slug invalido" })
    }
    if(erros.length > 0) {
        res.render("admin/addcategorias", {erros: erros})
    }
    else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
            new Categoria(novaCategoria).save().then(() => {
                req.flash("success_msg")
                res.redirect("/admin/categorias")
            }).catch((erro) => {
                req.flash("error_msg", "Houve um erro ao salvar a categoria")
                res.redirect("/admin/categorias")
            })
    }
    });



module.exports = router;