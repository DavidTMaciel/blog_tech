const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


//Model usuario 
require("../models/Usuario")
const Usuario = mongoose.model('Usuario');

//Validação de senhas e sessões

module.exports = function (passport){

    passport.use(new localStrategy({usernameField: 'email'}, (email, senha, done) =>{

        Usuario.findOne({email: email}).then((usuario) =>{
            if(!usuario){
                return done(null, false, {message: "Está conta não existe"})
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem)=>{
                if(batem){
                    return done(null, user)
                }else{
                    return done(null, false, {message: "Senh incorretas"})
                }
            })
        })
    }));

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    });

    passport.deserializeUser((usuario, done) => {
        User.findByid(id, (err, ususario)=>{
            done(err, user)
        })
    });

}