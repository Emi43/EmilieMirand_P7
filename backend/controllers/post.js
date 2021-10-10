const db = require('../config/db_config');
const jwt = require('jsonwebtoken');//pour importer le package jsonwebtoken//

exports.createPost = (req,res,next) => {
    db.query('INSERT INTO posts (post,user_id,data_of_post) VALUES(?,?,CURRENT_TIMESTAMP)',[req.body.post,req.body.userId],
    (err,data) => {
        if(err) {
           return res.status(400).json({err})
        };
        res.status(201).json({message:"votre message a été posté!!"});
    });
}

exports.modifyPost = (req,res,next) => {
    //verification du userId de la requête (qu'il corresponde bien au user_id du post) //
    const postId = req.params.id;
    const userId = req.body.userId;
    db.query(`SELECT user_id FROM posts WHERE id = ?`, [postId],(err,data) =>{
        const postUserId = data[0].user_id;
        if(err) {
            return res.status(400).send({message:"une erreur est survenue!!"})
        };
        if (postUserId !== userId) {
            res.status(400).send({message :"modification impossible: ce post appartient à un autre utilisateur"})
        };
        if(postUserId === userId) {
            db.query(`UPDATE posts SET post = ? where id = ? `,[req.body.post,postId],(err,data) => {
                if(err){
                    return res.status(400).send({message:"une erreur est survenue!!"})
                };
                res.status(200).json({message:"votre message a été modifié!!"});
            })
        }
    })
}
exports.getAllPost = (req,res,next) => {
    db.query(`SELECT * FROM posts ORDER BY data_of_post DESC`, (err,data) => {
        if(err){
            return res.status(400).send({message:"une erreur est survenue!!"})
        };
        res.status(201).send(data);
    })
}
exports.deletePost  = (req,res,next) => {
    //recuperation du userId a partir du token//
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;//userId récupéré à partir du token décodé//
    //recuperation du user_id du post//
    db.query(`SELECT user_id FROM posts WHERE id=?`,[req.params.id],(err,data) =>{
        const postUserId = data[0].user_id;
        if(err){
            return res.status(400).send({message:"une erreur est survenue!!"})
        };
        //recuperation du niveau admin à partir du userId//
        db.query(`SELECT admin FROM users WHERE id = ?`,[userId],(err,data) => {
            const admin = data[0].admin;
            if((postUserId !== userId) && (admin === 0)) {
                return res.status(400).send({message : "il est impossible de supprimer un post qui ne vous appartient pas !"})
            }
            if(((postUserId === userId) && (admin ===0)) || admin != 0) {
                db.query(`DELETE FROM posts WHERE id = ?`,[req.params.id],(err,data) =>{
                    if(err){
                        return res.status(400).send({message:"une erreur est survenue!!"})
                    }; 
                    res.status(200).json({message:"votre message a été supprimé!!"});
                })
            }    
        })
    });
}