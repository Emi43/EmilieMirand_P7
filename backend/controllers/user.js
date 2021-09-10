const db = require('../config/db_config');

exports.getUser = (req,res,next) => {
    db.query('SELECT id,firstname,lastname,email,password,picture FROM users WHERE id=?',[req.params.id], (err,data)=>{
        if(err){
           return res.status(400).send({message : "une erreur est survenue!!"})
        };
        res.status(201).send(data);
    })     
};

exports.login = (req,res,next) => {

};

exports.signup = (req,res,next) => {

};