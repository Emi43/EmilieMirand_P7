const express = require('express');//pour importer l'application express//
const router = express.Router();//pour créer un routeur express//

const userCtrl = require('../controllers/user');//pour importer les controllers//

router.get('/:id',userCtrl.getUser);








module.exports = router;//pour exporter le routeur vers app.js//