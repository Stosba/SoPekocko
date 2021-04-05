const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
// const AdminUser = require('../models/User');

// fonction pour masquer l'adresse mail
function mailcrypt (sentence) {
  if (typeof sentence === "string") { // opérateur typeof pour vérifier que l'email est une string
    let headMail = sentence.slice(0,1); // on garde la première lettre 
    let bodyMail = sentence.slice(1, sentence.length-4); // on selectionne l'ensemble du mail
    let bottomMail = sentence.slice(sentence.length-4, sentence.length); // sauf les 4 dernières lettres
    let final = []; 
    let crypted = bodyMail.split('');
    let cryptedMail = [];
    for(let i in crypted) { // boucle for pour remplacer les caractères sélectionnés par *
      crypted[i] = '*';
      cryptedMail += crypted[i];
    }
    final += headMail + cryptedMail + bottomMail
    return final;
  }
  console.log(sentence + " n'est pas un email");
  return false
};

exports.signup = (req, res, next) => { 
    bcrypt.hash(req.body.password, 10) // on sale le mot de passe 10fois
      .then(hash => { // on reçoit le hash dans la promesse
        const user = new User({ // puis création de l'utilisateur
          email: mailcrypt(req.body.email),
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    };

// exports.signup = (req, res, next) => {
//   if (req.body.email != 'admin@gmail.com') { 
//     bcrypt.hash(req.body.password, 10) // on sale le mot de passe 10fois
//       .then(hash => { // on reçoit le hash dans la promesse
//         const user = new User({ // puis création de l'utilisateur
//           email: mailcrypt(req.body.email),
//           password: hash
//         });
//         user.save()
//           .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
//           .catch(error => res.status(400).json({ error }));
//       })
//       .catch(error => res.status(500).json({ error }));
//   } else if (req.body.email == 'admin@gmail.com') {
//     bcrypt.hash(req.body.password, 10)
//       .then(hash => {
//         const adminUser = new amdinUser({
//           email: mailcrypt(req.body.email),
//           password: hash
//         });
//         adminUser.save()
//           .then(() => res.status(201).json({ message: 'Admin créé !' }))
//           .catch(error => res.status(400).json({ error }));
//       })
//       .catch(error => res.status(500).json({ error }));
//   }
// };
  
  exports.login = (req, res, next) => {
    User.findOne({ email: mailcrypt(req.body.email) }) //on vérifie que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la DB
      .then(user => {
        if (!user) { 
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // la fonction compare de bcrypt pour vérifier le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign( // fonction sign dejsonwebtoken pour encoder un nouveau token
                { userId: user._id }, // token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token)
                process.env.TOKEN, // chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder notre token
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };