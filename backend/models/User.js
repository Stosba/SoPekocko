const { Schema } = require("mongoose");

// Schema des users à  enregistrer
// il faudra installer le package node afin d'éviter les bugs d'adresse mail :
// npm install --save mongoose-unique-validator (from backend)

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const adminSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);
adminSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('AdminUser', adminSchema);