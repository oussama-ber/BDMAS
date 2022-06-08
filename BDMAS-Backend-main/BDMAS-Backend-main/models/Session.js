const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  state: { type: String, default: "Closed" },
  startDate: { type: Object },
  endDate: { type: Object },
  projectRef: { type: mongoose.Types.ObjectId, required: true, ref: "Project" },
  forms: [{ type: mongoose.Types.ObjectId, ref: "Form" }],
  listToken: [{ type: Object }],
  activated: { type: Boolean, default: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  creatorData: { type: Object },
  creatorImage: { type: Object },
  date: { type: Date },
  subSessions: [{ type: mongoose.Types.ObjectId, ref: "SubSession" }],

  doneSubSessions: { type: Number, default: 0 },
  pendingSubSessions: { type: Number, default: 0 },
  closedSubSessions: { type: Number, default: 0 },
});

module.exports = mongoose.model("Session", sessionSchema);
