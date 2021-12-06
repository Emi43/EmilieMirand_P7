const express = require('express');

const mysql = require('mysql');
const bodyParser = require('body-parser');//pour importer le package body-parser//
const path = require('path');
const helmet = require("helmet");//pour importer helmet//

const userRoutes =  require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

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
app.use(helmet());//helmet (module de Node)pour sécuriser les en-têtes http//

//je crée un middleware qui va répondre aux requêtes faites à /images et servir le dossier static image//
app.use('/images', express.static(path.join(__dirname, 'images')));

//routes vers les ressources de la base de donnée//
app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/comments',commentRoutes);
module.exports = app;
