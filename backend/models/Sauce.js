// schema des objets mis en vente

const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

const sauceSchema = mongoose.Schema({
  id: { type: String },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: [String]},
  usersDisliked: { type: [String]},
});

// Plugin pour Mongoose qui purifie les champs du model avant de les enregistrer dans la base MongoDB.
sauceSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model('Sauce', sauceSchema);