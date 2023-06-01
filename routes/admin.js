const express = require('express')
const router = express.Router();

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


module.exports = router;