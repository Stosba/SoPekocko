// logique metier pour les sauces
const fs = require('fs');
const Sauce = require('../models/Sauce');
const regex = /^[a-zA-Z0-9 _.,!()&]+$/;

// créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); //création d'une instance du modèle de sauce
    console.log(sauceObject);
    delete sauceObject._id; //suppression du faux_id envoyé par le front-end
    // si un champs manque
    if (!sauceObject.userId || !sauceObject.name || 
      !sauceObject.manufacturer || !sauceObject.description || 
      !sauceObject.mainPepper || !sauceObject.heat ||
      !req.file.path) {
        return res.status(500).json({error: 'Requête invalide'});
      }
    // si les regex ne sont pas bonnes
      if (!regex.test(sauceObject.name) || !regex.test(sauceObject.manufacturer) ||
      !regex.test(sauceObject.description) || !regex.test(sauceObject.mainPepper) ||
      !regex.test(sauceObject.heat)) {
        return res.status(500).json({error: 'Des champs contiennent des cractères invalides'});
      }
    // sinon création d'une nouvelle sauce
    const sauce = new Sauce({
    ...sauceObject, // L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
    //utilisation de req.protocol pour obtenir le premier segment de l'url ('http' ). Nous ajoutons '://' , puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ). Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.
    likes: 0, // set des likes/dislikes à zero
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
    });
    console.log(sauce);
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  };

//   récupérer une sauce spécifique
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // utilisation de la méthode findOne() dans notre modèle sauce pour trouver la sauce unique ayant le même _id que le paramètre de la requête
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };

//   modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? //on crée un objet sauceObject qui regarde si req.file existe ou non.
      { //S'il existe, on traite la nouvelle image, s'il n'existe pas, on traite simplement l'objet entrant
        ...JSON.parse(req.body.sauce), //On crée ensuite une instance Sauce à partir de sauceObject , puis on effectue la modification.
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
      } : { ...req.body }; 
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // utilisation dela méthode updatOne
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'})) //utilisation du paramètre id de la requête pour configurer notre Sauce avec le même_id qu'avant.
      .catch(error => res.status(400).json({ error }));
  };

//   supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //utilisation de l'ID que nous recevons comme paramètre pour accéder à la Sauce correspondant dans la base de données
      .then(sauce => {
        // if (sauce.userId !== req.userId) {  //on compare l'id de l'auteur de la sauce et l'id de l'auteur de la requête
        //   res.status(401).json({message: "action non autorisée"});  // si ce ne sont pas les mêmes id = code 401: unauthorized.
        //   return sauce;
        // }
        const filename = sauce.imageUrl.split('/images/')[1]; // séparation du nom de fichier avec le segment /images/
        fs.unlink(`images/${filename}`, () => { //fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé
          Sauce.deleteOne({ _id: req.params.id }) // supression de la sauce de la DB avec callback
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };
  
  //   récupérer la liste des sauces mise en vente
exports.getAllSauce = (req, res, next) => {
    Sauce.find() //méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant toutes les sauces dans notre DB
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };

  // Gestion des likes
exports.likeSauce = (req, res, next) => {
    // On récupère les informations de la sauce
    Sauce.findOne({ _id: req.params.id })
   .then(sauce => {

       // Selon la valeur recue pour 'like' dans la requête :
       switch (req.body.like) {
           //Si +1 dislike :
           case -1:
               Sauce.updateOne({ _id: req.params.id }, { //methode updateOne pour modifier les likes
                   $inc: {dislikes:1}, // methode $inc pour incrémenter un dislike
                   $push: {usersDisliked: req.body.userId}, // opérateur $push pour ajouter le dislike à l'aray contenant les dislikes
                   _id: req.params.id
               })
                   .then(() => res.status(201).json({ message: 'Dislike ajouté !'}))
                   .catch( error => res.status(400).json({ error }))
               break;
           
           //Si -1 Like ou -1 Dislike :
           case 0:
               // -1 Like :
               if (sauce.usersLiked.find(user => user === req.body.userId)) {
                   Sauce.updateOne({ _id : req.params.id }, {
                       $inc: {likes:-1}, // incrémentation d'une valeur négative
                       $pull: {usersLiked: req.body.userId}, // retrait du like de l'aray
                       _id: req.params.id
                   })
                       .then(() => res.status(201).json({message: ' Like retiré !'}))
                       .catch( error => res.status(400).json({ error }))
               }

               // -1 dislike 
               if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                   Sauce.updateOne({ _id : req.params.id }, {
                       $inc: {dislikes:-1},
                       $pull: {usersDisliked: req.body.userId},
                       _id: req.params.id
                   })
                       .then(() => res.status(201).json({message: ' Dislike retiré !'}))
                       .catch( error => res.status(400).json({ error }));
               }
               break;
           
           // +1 Like 
           case 1:
               Sauce.updateOne({ _id: req.params.id }, {
                   $inc: { likes:1},
                   $push: { usersLiked: req.body.userId},
                   _id: req.params.id
               })
                   .then(() => res.status(201).json({ message: 'Like ajouté !'}))
                   .catch( error => res.status(400).json({ error }));
               break;
           default:
               return res.status(500).json({ error });
       }
   })
   .catch(error => res.status(500).json({ error }))
};