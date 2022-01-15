const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./../../models/User');
const Task = require('../../models/Task');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  username: 'tester123',
  email: 'tester123@example.com',
  password: 'tester123',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  username: 'vannguyen_tester',
  email: 'vannguyen_tester@example.com',
  password: 'vannguyen_tester',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Task One',
  completed: true,
  owner: userOne._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Task Two',
  completed: true,
  owner: userTwo._id,
};

const setupDB = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  setupDB,
};
