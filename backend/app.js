const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require("helmet");
const cookieSession = require('cookie-session');
const nocache = require('nocache');
const dotenv = require("dotenv");
dotenv.config();

// lien avec les dossier routes
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// route qui fait le lien avec la base de donnée mongodb
mongoose.connect(process.env.DB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

// MIDDLEWARE
// headers qui configure les actions à implémenter CORS
app.use((req, res, next) => {
    // d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
    res.setHeader('Access-Control-Allow-Origin', '*');
    // d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Options pour sécuriser les cookies
const expiryDate = new Date(Date.now() + 3600000); // 1 heure (60 * 60 * 1000)
app.use(cookieSession({
  name: 'session',
  secret: process.env.SEC_SES,
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000',
    expires: expiryDate
  }
}));

// Helmet permet de sécuriser notre app express en paramettrant divers headers http.
  app.use(helmet());

// Désactive la mise en cache du navigateur
  app.use(nocache());

// body-parser qui permet d'extraire l'objet JSON de nos requetes post
  app.use(bodyParser.json());

// route permettant d'afficher les images sur le frontend
  app.use('/images', express.static(path.join(__dirname, 'images')));

// importation des routes pour les utiliser
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

  module.exports = app;