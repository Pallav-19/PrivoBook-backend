const mongoose = require("mongoose");
const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default:"general"
  },
  date: {
    type: Date,
    required: Date.now,
  },
});
module.exports =new mongoose.model("Note", notesSchema);
