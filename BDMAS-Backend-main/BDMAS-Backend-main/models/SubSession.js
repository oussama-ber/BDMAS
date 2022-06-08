const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subSessionSchema = new Schema({
  state: { type: String, default: "Closed", required: true },
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Object },
  endDate: { type: Object },
  forms: [{ type: mongoose.Types.ObjectId, ref: "Form" }],
  listToken: [{ type: Object }],
  bankMembers: [{ type: Object }],
  answers: [{type: Object}],
  projectRef: { type: mongoose.Types.ObjectId, required: true, ref: "Project" },
  sessionRef: { type: mongoose.Types.ObjectId, required: true, ref: "Session" },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  answersRef: [{type: mongoose.Types.ObjectId, ref:'Answer' }],
  creatorData: { type: Object },
  createdIn: { type: Date },
  activated: { type: Boolean, default: true },
});

module.exports = mongoose.model("SubSession", subSessionSchema);
