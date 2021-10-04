const express = require('express');//pour importer l'application express//
const router = express.Router();//pour créer un routeur express//
const auth = require('../middleware/auth');//pour importer le middleware qui protège mes routes//
const multer = require('../middleware/multer-config');//pour importer le middleware qui permet de télecharger des fichiers images depuis le frontend//

const userCtrl = require('../controllers/user');//pour importer les controllers//

router.get('/',auth,userCtrl.getAllUser);
router.get('/:id',userCtrl.getUser);
router.post('/signup',multer, userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/:id',auth,userCtrl.deleteUser);
router.put('/:id',auth,multer,userCtrl.modifyUser);
router.post('/userId',userCtrl.getUserId);//route qui renvoie le userId à partir du token//








module.exports = router;//pour exporter le routeur vers app.js//