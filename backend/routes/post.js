const express = require('express');//pour importer l'application express//
const router = express.Router();//pour créer un routeur express//
const auth = require('../middleware/auth');//pour importer le middleware qui protège mes routes/

const postCtrl = require('../controllers/post');

router.post('/',auth,postCtrl.createPost);
router.put('/:id',postCtrl.modifyPost);
module.exports = router;//pour exporter le routeur vers app.js//