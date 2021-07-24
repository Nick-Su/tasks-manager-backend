const mongoose = require("mongoose");

const schema = mongoose.Schema({
  description: String,
  isCompleted: Boolean,
})

module.exports = mongoose.model("Task", schema)