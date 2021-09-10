const express = require('express');

const mysql = require('mysql');
const bodyParser = require('body-parser');//pour importer le package body-parser//

const userRoutes =  require('./routes/user');

const app = express();


//middleware appliqué à toutes les routes,requêtes envoyées au serveur//
//afin d'éviter que le système de sécurité "CORS" ne bloque les appels http entre les deux serveurs differents//
//ajout de headers sur l'objet reponse pour permettre à l'application d'accéder à l'API//
app.use((req, res, next) => {//middleware général appliqué à toutes les routes//
    res.setHeader('Access-Control-Allow-Origin', '*');//pour accéder à l'API depuis nimporte quelle origine//
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//pour ajouter les headers mentionnés aux requêtes envoyés vers l'API//
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//pour envoyer des requêtes avec les methodes mentionnées//
    next();//next permet d'envoyer le réponse et de passer au middleware suivant//
});

app.use(bodyParser.json());//pour transformer le corps de la requête en json//  


//routes vers les ressources de la base de donnée//
app.use('/api/users',userRoutes);
module.exports = app;