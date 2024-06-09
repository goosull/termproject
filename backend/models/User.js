const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {type: String, unique: true},
  passwd: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;