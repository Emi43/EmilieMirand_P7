const db = require('../config/db_config');
const jwt = require('jsonwebtoken');//pour importer le package jsonwebtoken//

exports.createComment = (req,res,next) => {
    db.query(`INSERT INTO comments(comment,post_id,user_id,data_of_comment) VALUES(?,?,?,CURRENT_TIMESTAMP)`,[req.body.comment,req.body.post_id,req.body.user_id],(err,data) =>{
        if(err){
            return res.status(400).json({err})
        };
        res.status(201).json({message:"votre commentaire a été posté!!"});
    });
}

exports.modifyComment = (req,res,next) => {
    const commentId = req.params.id;
    db.query(`SELECT user_id FROM comments WHERE id=? `,[commentId],(err,data) =>{
        if(err){
            return res.status(400).send({message:"une erreur est survenue!!"})
        };
        if(data[0].user_id !== req.body.userId) {
            res.status(400).send({message:"modification impossible!ce commentaire appartient à un autre utilisateur"})
        };
        if(data[0].user_id === req.body.userId) {
            db.query(`UPDATE comments SET comment = ? WHERE id = ?`,[req.body.comment,req.params.id],(err,data) => {
                if(err){
                    return res.status(400).send({message:"une erreur est survenue!!"})
                };
                res.status(200).json({message:"votre commentaire a été modifié"});
            })
        }
    })
}