const db = require('../config/db_config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');//pour importer le package jsonwebtoken//
const fs = require('fs');//importer le package fs(file system) de node pour accéder aux opérations liées aux fichiers//

exports.getAllUser = (req,res,next) => {
    db.query(`SELECT id,firstname,lastname,email,password,picture FROM users`, (err,data)=> {
        if(err){
           return res.status(400).send({message : "une erreur est survenue!!"})
        };
        res.status(201).send(data);
    })     
}
exports.getUser = (req,res,next) => {
    db.query(`SELECT firstname,lastname,email,password,picture FROM users WHERE id=?`,[req.params.id], (err,data)=>{
        if(err){
           return res.status(400).send({message : "une erreur est survenue!!"})
        };
        res.status(201).send(data);
    })     
}
//req à envoyer en form-data//
exports.signup = (req,res,next) => {
    const picture = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const user = req.body;
    //on verifie que l'email existe pas//
    db.query(`SELECT * FROM users WHERE email = ?`,[user.email], (err,data) => {
        if(err){
            return res.status(400).send({message : "une erreur est survenue!"})
        };
        if(data.length === 0){
            bcrypt.hash(user.password,10)//pour appeler la fonction de hachage de bcrypt et "saler" le mot de passe 10fois//
            .then(hash => {
                db.query(`INSERT INTO users(firstname,lastname,email,password,picture) VALUES (?,?,?,?,?)`,[user.firstname,user.lastname,user.email,hash,picture] ,(err,data) => {
                    if (err) { return res.status(400).json({err}) };
                    res.status(200).json({message : "Votre compte a bien été créé"});
                })
            })
        }
        else { return res.status(400).send({message : "Un compte utilisateur existe déjà avec cette adresse mail!!"}) }
    })
}

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
                    'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h'}
                )
            })
        });
    })
}
exports.deleteUser = (req,res,next) => {
    //recuperation du userId a partir du token//
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;//userId récupéré à partir du token décodé//
    //recuperation du niveau admin à partir du userId//
    db.query(`SELECT admin FROM users WHERE id = ?`,[userId],(err,data) => {
        if(err){
            return res.status(400).send({message : "une erreur est survenue !"})
        };
        const admin = data[0].admin;
        const paramsId = Number(req.params.id)
        //supression du compte si les droits admin le permettent//
        if((paramsId !== userId) && (admin === 0)) {
            return res.status(400).send({message : "il est impossible de supprimer un compte utilisateur qui ne vous appartient pas !"})
        }
        if((paramsId === userId) || (admin === 1)) {
            db.query(`SELECT picture FROM users WHERE id=?`,[paramsId],(err,data) =>{
                if(err){
                    return res.status(400).json({err}) 
                };
                const imageUrl = data[0].picture;
                const filename = imageUrl.split('/images/')[1];
                //supp de l'image//
             fs.unlink(`images/${filename}`,() => {
                db.query(`DELETE FROM users WHERE id = ? `, [paramsId], (err,data) => {
                    if(err){
                    return res.status(400).send({message : "une erreur est survenue !"})
                };
                res.status(200).json({message : "le compte utilisateur a été supprimé avec succés!"}); 
            })
        })
    })
    }
})  
}
 
exports.modifyUser = (req,res,next) => {
    const user = req.body;
    if (req.params.id === user.userId) {
        if(req.file){
            db.query(`SELECT picture FROM users WHERE id=?`,[req.params.id],(err,data) =>{
                if(err){
                    return res.status(400).json({err}) 
                };
                const imageUrl = data[0].picture;
                const filename = imageUrl.split('/images/')[1];
                //supp de l'image//
                fs.unlink(`images/${filename}`,() => {
                    const picture = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; 
                bcrypt.hash(user.password,10)//pour appeler la fonction de hachage de bcrypt et "saler" le mot de passe 10fois//
                .then(hash => {
                db.query(`UPDATE users SET firstname = ?,lastname = ?,email = ?,password = ?,picture = ? WHERE id = ?`,[user.firstname,user.lastname,user.email,hash,picture,user.userId] ,(err,data) => {
                    if (err) { 
                        return res.status(400).json({err})
                    };
                    res.status(200).json({message : "Votre compte a bien été modifié!!"});
            })
        })
    });
})
}else{
    bcrypt.hash(user.password,10)//pour appeler la fonction de hachage de bcrypt et "saler" le mot de passe 10fois//
    .then(hash => {
    db.query(`UPDATE users SET firstname = ?,lastname = ?,email = ?,password = ? WHERE id = ?`,[user.firstname,user.lastname,user.email,hash,user.userId] ,(err,data) => {
        if (err) { 
            return res.status(400).json({err})
        };
        res.status(200).json({message : "Votre compte a bien été modifié!!"});
    })    
})
}
    if (req.params.id !== user.userId) {
        res.status(400).json({message : "Modification impossible!!"});
    }
}
}     
 
exports.getUserId = (req,res,next) => {
    //recuperation du userId à partir du token//
    const token = req.body.token;
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//je décode le token avec la méthode verify qui devient un objet js//
    const userId = decodedToken.userId;//j'extrait le userId du token//
    //recuperation du niveau admin a partir du userId//
    db.query(`SELECT admin FROM users WHERE id = ?`,[userId],(err,data) => {
        if(err) {
            return res.status(400).send({message : "une erreur est survenue!!"})
        };
        res.status(200).json ({
            userId : userId,
            admin : data[0].admin});
    })
};
