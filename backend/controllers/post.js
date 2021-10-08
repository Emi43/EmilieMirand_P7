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