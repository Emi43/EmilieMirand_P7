//middleware d'authentification//
const jwt = require('jsonwebtoken');//pour importer le package jsonwebtoken//

module.exports = (req, res, next) => {
  try {
    //on extrait le token d'entrée du header authorization de la requête entrante 
    //je 'split' autours des espaces et récupération du 2ème élément du tableau généré//
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//je décode le token avec la méthode verify qui devient un objet js//
    const userId = decodedToken.userId;//j'extrait le userId du token//
    //si il y a un userId dans le corps de la requête et qu'il est different de userId//
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();//sinon si tout est correct je passe la requête au prochain middleware//
    }
  } catch {
    res.status(401).json({//renvoi d'une erreur 401 problème d'authentification//
      error: new Error('Invalid request!')
    });
  }
};