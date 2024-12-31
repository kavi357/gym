const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contactSchema = new Schema({
  fname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
  sup: {
    type: String,
  },
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
