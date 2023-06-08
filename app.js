//Carregando Modulos
    const express = require('express');
    const { engine } = require ('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const admin = require('./routes/admin')
    const path = require('path');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash');
    require("./models/Postagens")
    const Postagem = mongoose.model('Postagens');
    require("./models/Categorias");
    const Categoria = mongoose.model('Categorias');
    const usuarios = require("./routes/usuarios")

//Configurações
    //Sessão
        app.use(session({
            secret: "secret",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash());
    //Middleware
        app.use((req,res , next) =>{
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            next();
        })
    //BodyParser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    //Handlebars
        app.engine('handlebars', engine());
        app.set("view engine", "handlebars")
        app.set('views', 'views');
    //Mongose
    mongoose.Promise = global.Promise
    mongoose.connect(
        process.env.MONGO_URI || "mongodb://0.0.0.0:27017/blogapp", 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then( () => {
            console.log("Connected to MongoDB");
            
        }).catch(function(erro){
            console.log(erro);
        }); 

    //Public
    app.use(express.static(path.join(__dirname, "public")));

//Rotas
    //Rota inicial
    app.get("/", function(req, res){
        Postagem.find().lean().populate("categoria").sort({data:"desc"}).then((postagens)=>{
            res.render("index", {postagens: postagens});
        }).catch((error)=>{
            req.flash("error_msg","Houve um erro interno");
            res.redirect("/404");
        })
        
    })
    //Rota de erro
    app.get("/404",(req, res) => {
        res.send("Error 404!")
    })
    //Rota de postagens Homepage
    app.get("/postagens/:slug", (req, res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((postagens)=>{
            if(postagens){
                res.render("postagem/index", {postagens: postagens});
            }else{
                req.flash('error_msg',"Essa postagem não existe.");
                res.redirect('/');
            }

        }).catch((eror)=>{
            req.flash('error_msg',"Houve um erro interno");
            res.redirect('/');
        })
    })

    
    //Rota listagem categorias na pag inicial
    app.get("/categorias", (req, res)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render("categorias/index", {categorias: categorias});
        }).catch((erro)=>{
            req.flash('error_msg', "Houve um erro interno a listar as categorias");
            res.redirect('/');
        });
    });

    app.get("/categorias/:slug", (req, res)=>{
        Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
            if(categoria){

                Postagem.find({categoria: categoria._id}).lean().then((postagens)=>{
                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
                });

            }else{
                req.flash('error_msg',"Essa categoria não existe.");
                res.redirect('/');
            };
        }).catch((error)=>{
            req.flash('error', "Houve um error interno a carregar a pagina");
            res.redirect('/');
        })
    });

    app.use('/admin', admin);
    app.use('/usuarios', usuarios);


//Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log('Servidor rodando na porta ' + PORT);
});