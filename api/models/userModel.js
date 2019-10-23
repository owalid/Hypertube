const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    default: 'us'
  },
  picture: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: false
  },
  confHash: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array,
    default: null
  },
  strategy: {
    type: String,
    default: 'locale',
  },
  strategyId: {
    type: String,
    default: '',
  },
  bookmarks: {
    type: Array,
    default: []
  },
  follows: {
    type: Array,
    default: []
  }
});

export const User = mongoose.model("User", UserSchema);