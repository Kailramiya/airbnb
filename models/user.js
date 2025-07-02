const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    match: /^[a-zA-Z]+$/
  },
  lastName: {
    type: String,
    // required: true,
    trim: true,
    match: /^[a-zA-Z]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['guest', 'host'],
    default: 'guest'
  },
  favourite :[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home'
  }]
  
});

module.exports = mongoose.model('User', userSchema);