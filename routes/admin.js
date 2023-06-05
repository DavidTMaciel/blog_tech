const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Categorias")
const Categoria = mongoose.model('Categorias');
require("../models/Postagens");
const Postagens = mongoose.model('Postagens');

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
        }).catch((erro) => { //Tratamento do erro
            req.flash('error_msg', "Houve um erro ao registrar as categorias.");
            res.redirect("/admin");
        });
        
    });
//Rota ADD categoria
    router.get('/categorias/add', (req, res) => {
        res.render("admin/addcategorias");
    });
    router.post('/categorias/nova', (req, res) => {

    let erros = [];
    //Validação do envio do formulario, com os dados das categorias

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
                req.flash("success_msg", "Categoria criada com sucesso!");
                res.redirect("/admin/categorias")
            }).catch((erro) => {
                req.flash("error_msg", "Houve um erro ao salvar a categoria")
                res.redirect("/admin/categorias")
            })
    }
    });
//Rota edição de categorias
    router.get("/categorias/editar/:id", (req, res) => {
        //Pesquisando um registro que tenha um id = ao passado na rota
        Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
            res.render("admin/editcategorias", {categoria: categoria});
        }).catch((erro) => {
            req.flash("error_msg", "Esta categoria não existe")
            res.redirect("/admin/categorias")
        })
        
    });
//Aplicando a edição de categorias
    router.post("/categorias/editar", (req, res) => {
        //Chamando o model, procurando um id que foi passado no form do front-end dentro do back-end 
        Categoria.findOne({_id: req.body.id}).then((categoria) => {
            
            categoria.nome = req.body.nome; //Pegando o campo nome e atribuindo
            categoria.slug = req.body.slug;

            //Validação da edição



            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso")
                res.redirect("/admin/categorias")
            }).catch((erro)=> {
                req.flash("error_msg", "Houve um erro interno ao salvar a edição categoria")
                res.redirect("/admin/categorias")
            })

        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao editar a categoria")
            res.redirect("/admin/categorias");
        })
    })

//Rota Deletar Categorias

router.post("/categorias/deletar", (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
        req.flash("succes_msg", "Categoria deletada com sucesso")
        res.redirect("/admin/categorias")
    }).catch(()=>{
        req.flash("error_msg", "Houve um erro ao deletar a categoria")
        res.redirect("/admin/categorias")
    })


})

//Rota de postagens

router.get("/postagens", (req, res) =>{

    Postagens.find().lean().populate({path: "categoria", strictPopulate:false}).sort({data:"desc"}).then( (postagens) => {
       res.render("admin/postagens", {postagens: postagens}); 
    }).catch( (err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens");
        res.redirect("/admin");
    });

    

})

router.get("/postagens/add", (req, res) =>{
    Categoria.find().lean().then((categorias) =>{
        res.render("admin/addpostagens" , {categorias: categorias} )
    }).catch((err) =>{
        res.flash("error_msg", "Houve um erro ao salvar a postagen")
        res.render("/admin/postagens")
    });
    
})

//Rota salvando postagens no banco de dados
 router.post("/postagens/nova" , (req, res) =>{
    var erros = [];

    if(req.body.categorias == "0"){
        erros.push({text: "Categoria invalida, resgistre uma categoria"})
    }
    if(erros.length > 0){
        req.flash("erro_msg", "Ocorreu um erro")
        res.render("/admin/addpostagens")
    }else{
        const novaPostagens = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            slug: req.body.slug,
            categoria: req.body.categoria
        };

        new Postagens(novaPostagens).save().then(()=> {
            req.flash("success_msg", "Postagem criada com sucesso!");
            res.redirect("/admin/postagens");
        }).catch((erro) => {
            req.flash("error_msg", "Ocorreu um erro ao adicionar a postagem");
            res.redirect("/admin/postagens");
        })

    }
 })


module.exports = router;