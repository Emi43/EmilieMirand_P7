const express = require('express');//pour importer l'application express//
const router = express.Router();//pour créer un routeur express//
const auth = require('../middleware/auth');//pour importer le middleware qui protège mes routes/

const commentCtrl = require('../controllers/comment');

router.post('/',auth,commentCtrl.createComment);
router.put('/:id',auth,commentCtrl.modifyComment);
router.get('/:postId',auth,commentCtrl.getPostComments);
router.delete('/:id',commentCtrl.deleteComment);


module.exports = router;//pour exporter le routeur vers app.js//