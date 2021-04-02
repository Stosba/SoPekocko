const passwordValidator = require('password-validator');

// Schéma de mot de passe
const passwordSchema = new passwordValidator();

// Contraintes du mot de passe
passwordSchema
.is().min(8)                                    // minimun 8 lettres
.has().uppercase()                              // au moins une majuscule
.has().lowercase()                              // au moins une minuscule
.has().digits()                                 // au moins un chiffre
.has().not().spaces()                           // pas d'espaces 
.is().not().oneOf(['Passw0rd', 'Password123']); // valeurs à proscrire

module.exports = passwordSchema;