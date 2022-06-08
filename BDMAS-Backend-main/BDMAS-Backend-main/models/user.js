const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, minlength: 6 },
  role: { type: String, required: true},
  image: { type: String},
  resetToken: {type: String},
  activated: {type: Boolean},
  resetTokenExpiration: {type: Date},
  projects: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Project' }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
