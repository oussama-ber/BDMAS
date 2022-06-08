const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  address: { type: String, required: true },
  startDate: { type: Object },
  endDate: { type: Object },
  sessions: [{ type: mongoose.Types.ObjectId, required: true, ref: "Session" }],
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  creatorData: { type: Object },
  colleagues: [{ type: Object }],
  doneSessions: { type: Number, default: 0 },
  pendingSessions: { type: Number, default: 0 },
  closedSessions: { type: Number, default: 0 },
  date: { type: Date },
  createdBy: Object,
  state: { type: String, default: "Closed" },
  activated: { type: Boolean, default: true },
});

module.exports = mongoose.model("Project", projectSchema);
