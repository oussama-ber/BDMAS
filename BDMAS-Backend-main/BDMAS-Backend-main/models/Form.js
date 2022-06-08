const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const formSchema = new Schema({
  form: Object,
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
  createdBy: Object,
  hidden:{ type: Boolean, default: false},
});

module.exports = mongoose.model("Form", formSchema);
