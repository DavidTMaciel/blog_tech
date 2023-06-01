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
    app.use('/admin', admin);

//Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log('Servidor rodando na porta ' + PORT);
});