const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const answerSchema = new Schema({
  email: { type: String },
  answer: {type: Object},
  token: { type: String, required: true },
  activated: { type: Boolean },
  date: { type: Date },
  projectRef: { type: mongoose.Types.ObjectId, required: true, ref: "Project" },
  sessionRef: { type: mongoose.Types.ObjectId, required: true, ref: "Session" },
  subSessionRef: { type: mongoose.Types.ObjectId, required: true, ref: "SubSession" },
  formRef: { type: mongoose.Types.ObjectId, required: true, ref: "Form" },
});

module.exports = mongoose.model("Answer", answerSchema);
