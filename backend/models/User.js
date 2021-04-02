const { Schema } = require("mongoose");

// Schema des users à  enregistrer
// il faudra installer le package node afin d'éviter les bugs d'adresse mail :
// npm install --save mongoose-unique-validator (from backend)

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');


const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// Plugin pour Mongoose qui purifie les champs du model avant de les enregistrer dans la base MongoDB.
userSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model('User', userSchema);