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

exports.getPostComments = (req,res,next) => {
    db.query(`SELECT * FROM comments WHERE post_id = ?`,[req.params.postId],(err,data) =>{
        if(err){
            return res.status(400).send({message:"une erreur est survenue!"})
        };
        res.status(201).send(data);
    })
}

exports.deleteComment = (req,res,next) => {
    //recuperation du user_id  du commentaire et comparaison avec l'id de l'utilisateur connecté//
    db.query(`SELECT user_id FROM comments WHERE id =?`,[req.params.id],(err,data) => {
        if(err) {
            return res.status(400).send({message:"une erreur est survenue!"})
        };
        const comment_user_id = data[0].user_id;
        if (((comment_user_id == req.body.userId)) && (req.body.admin == 0) || req.body.admin !== 0) {
            db.query(`DELETE FROM comments WHERE id = ?`,[req.params.id], (err,data) => {
                if(err) {
                    return res.status(400).send({message:"une erreur est survenue!"})
                };
                res.status(200).json({message:"le commentaire a été supprimé!"});  
            })
        }
        if ((comment_user_id !== req.body.userId) && (req.body.admin == 0)) {
            return res.status(400).send({message:"vous ne pouvez pas supprimer un commentaire qui ne vous appartient pas"})
        }
    })
}

exports.deleteComment = (req,res,next) => {
    //recuperation du userId du front à partir du token//
    const token = req.body.token;
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//je décode le token avec la méthode verify qui devient un objet js//
    const userId = decodedToken.userId;//j'extrait le userId du token//
    //recuperation du user_id du commentaire//
    db.query(`SELECT user_id FROM comments WHERE id =?`,[req.params.id],(err,data) => {
       const comment_user_id = data[0].user_id;
       if(err) {
        return res.status(400).send({message:"une erreur est survenue!"})
    };
    //recuperation du niveau admin à partir du userId//
    db.query(`SELECT admin FROM users WHERE id = ?`,[userId],(err,data) => {
        const admin = data[0].admin;
        if((commentUserId !== userId) && (admin === 0)){
            return res.status(400).send({message:"vous ne pouvez pas supprimer un commentaire qui ne vous appartient pas"})
        }
        if(((commentUserId === userId) && (admin === 0)) || admin !== 0){
            db.query(`DELETE FROM comments WHERE id=?`,[req.params.id],(err,data)=> {
                if(err) {
                    return res.status(400).send({message:"une erreur est survenue!"})
                };
                res.status(200).json({message:"le commentaire a été supprimé!"});  
            })
        } 
        })
    });
}