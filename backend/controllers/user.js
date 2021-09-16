const db = require('../config/db_config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');//pour importer le package jsonwebtoken//
const fs = require('fs');//importer le package fs(file system) de node pour accéder aux opérations liées aux fichiers//


exports.getUser = (req,res,next) => {
    db.query(`SELECT id,firstname,lastname,email,password,picture FROM users WHERE id=?`,[req.params.id], (err,data)=>{
        if(err){
           return res.status(400).send({message : "une erreur est survenue!!"})
        };
        res.status(201).send(data);
    })     
};

exports.signup = (req,res,next) => {
    const user = req.body;
    //on verifie que l'email existe pas//
    db.query(`SELECT * FROM users WHERE email = ?`,[user.email], (err,data) => {
        if(err){
            return res.status(400).send({message : "une erreur est survenue!"})
        };
        if(data.length === 0){
            bcrypt.hash(user.password,10)//pour appeler la fonction de hachage de bcrypt et "saler" le mot de passe 10fois//
            .then(hash => {
                db.query(`INSERT INTO users(firstname,lastname,email,password) VALUES (?,?,?,?)`,[user.firstname,user.lastname,user.email,hash] ,(err,data) => {
                    if (err) { return res.status(400).json({err}) };
                    res.status(200).json({message : "Votre compte a bien été créé"});
                })
            })
        }
        else { return res.status(400).send({message : "Un compte utilisateur existe déjà avec cette adresse mail!!"}) }
    })
};

exports.login = (req,res,next) => {
    //recherche du hash dans la base de donnée//
    db.query(`SELECT * FROM users WHERE email = ?`,[req.body.email], (err,data) =>{
        if (err || data[0] === undefined) {
          return res.status(400).send({message : "utilisateur non trouvé !!"})  
        };
        bcrypt.compare(req.body.password, data[0].password)//on utilise la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données//
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              //userId: data[0].id//
              token: jwt.sign(
                  { userId: data[0].id},
                    'process.env.RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h'}
              )
            })
          });
          
    })
}
