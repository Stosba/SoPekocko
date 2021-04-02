// middleware qui protégera les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes.

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try { // utlisation de try/ catch pour prévenir les éventuels problèmes
    const token = req.headers.authorization.split(' ')[1]; // extraire le token du header Authorization de la requête entrante. Utilisation de la fonction split pour récupérer tout après l'espace dans le header.
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // fonction verify pour décoder le token
    const userId = decodedToken.userId; // extraction de l'ID utilisateur de notre token
    if (req.body.userId && req.body.userId !== userId) { // puis comparaison sinon erreur
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};