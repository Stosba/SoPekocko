const { Schema } = require("mongoose");

// Schema des users Ã  enregistrer
// il faudra installer le package node afin d'Ã©viter les bugs d'adresse mail :
// npm install --save mongoose-unique-validator (from backend)

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);