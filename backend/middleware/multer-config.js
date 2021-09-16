const multer = require('multer');//pour importer multer//

//dictionnaire des mimes_types possibles pour les images//
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {//pour indiquer à multer d'enregistrer les fichiers dans le dossier images//
    callback(null, 'images');
  },
  filename: (req, file, callback) => {//pour indiquer à multer comment configurer le nom des fichiers téléchargés création d'un nom unique//
    const name = file.originalname.split(' ').join('_');//remplacer les espaces du nom d'origine par des '_'//
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);//nom final généré//
  }
});
//j'exporte le middleware multer configuré j'ajoute single pour signifier qu'il s'agit d'un fichier unique//
module.exports = multer({storage}).single('image');