const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  nonce: {
    type: Number,
    default: Math.floor(Math.random() * 10000),
  },
  publicAddress: {
    type: String,
    required: true,
  },
  profile:{
    type: String
  },
  joined:{
    type: String
  }
  
});

module.exports = User = mongoose.model("user", UserSchema);