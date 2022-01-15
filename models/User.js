const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Task = require('./Task');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw Error('Email invalid');
    },
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  avatar: {
    type: Buffer,
  },
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

// Get infomation profile
userSchema.methods.toJSON = function () {
  const publicObj = this.toObject();

  delete publicObj.password;
  delete publicObj.tokens;

  return publicObj;
};

// Generate Token
userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);

  this.tokens.push({ token });
  await this.save();

  return token;
};

// Find Credentials
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Unable to login');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Unable to login');

  return user;
};

// Hash password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 6);
  }

  next();
});

// Remove All Task Of User
userSchema.pre('remove', async function (next) {
  await Task.deleteMany({ owner: this._id });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
