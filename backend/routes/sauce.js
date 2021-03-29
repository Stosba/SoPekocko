// ROUTES vers les objets

const express = require('express');
const router = express.Router();

// importation notre middleware et le passons comme argument aux routes à protéger
const auth = require('../middleware/auth');
// importation du middleware multer
const multer = require('../middleware/multer-config');

// importation de la logique metier pour les sauces
const sauceCtrl = require('../controllers/sauce');

//   enregistrer des sauces dans la base de donnée !!!important : mettre le multer après l'auth pour ne pas sauvegarder des fichiers non authentifiÃ©s dans la base de donnÃ©es!!!
  router.post('/', auth, multer, sauceCtrl.createSauce);

//   mettre à jour une sauce
  router.put('/:id', auth, multer, sauceCtrl.modifySauce);

//   supprimer une sauce
  router.delete('/:id', auth, sauceCtrl.deleteSauce);

//   récupérer une sauce spécifique 
  router.get('/:id', auth, sauceCtrl.getOneSauce);

//   récupérer la liste des sauces mises en vente
  router.get('/', auth, sauceCtrl.getAllSauce);

//  like/dislike
  router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;