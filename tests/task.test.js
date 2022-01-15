const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./../app');
const User = require('./../models/User');
const {
  userOne,
  userOneId,
  setupDB,
  userTwo,
  taskOne,
  taskTwo,
} = require('./fixtures/db');
const Task = require('../models/Task');

jest.setTimeout(20000);
const API = '/api/v1';

beforeEach(setupDB);

beforeAll(() => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('Connect DB'))
    .catch((e) => console.log(e));
});

test('Should be create task for user', async () => {
  const response = await request(app)
    .post(`${API}/tasks`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Clean my house',
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
});

test('Should be get all tasks for user', async () => {
  const response = await request(app)
    .get(`${API}/tasks`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(1);
});

test('Should update task from user', async () => {
  const response = await request(app)
    .patch(`${API}/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'NEW: Task One',
    })
    .expect(200);

  const task = await Task.findById(taskOne._id);
  expect(task.name).toBe('NEW: Task One');
});

test('Should not update task from another user', async () => {
  const response = await request(app)
    .patch(`${API}/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      name: 'FAIL: NEW TASK',
    })
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task.name).toBe('Task One');
});

test('Should delete task from user', async () => {
  const response = await request(app)
    .delete(`${API}/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(204);
  const task = await Task.findById(taskOne._id);
  // task removed in database
  expect(task).toBeNull();
});

test('Should not delete task from another user', async () => {
  const response = await request(app)
    .delete(`${API}/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const task = await Task.findById(taskOne._id);
  // task still in database
  expect(task).not.toBeNull();
});
