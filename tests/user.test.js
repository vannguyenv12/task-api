const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./../app');
const User = require('./../models/User');
const { userOne, userOneId, setupDB } = require('./fixtures/db');

jest.setTimeout(20000);

const API = '/api/v1';

beforeAll(() => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('Connect DB'))
    .catch((e) => console.log(e));
});

beforeEach(setupDB);

describe('Test Auth API /auth', () => {
  test('Should be register user', async () => {
    const response = await request(app)
      .post(`${API}/auth/register`)
      .send({
        username: 'testers1',
        email: 'testers1@example.com',
        password: 'testers1',
      })
      .expect(201);

    // response.body is object -> {user: { username: ..., email: ..., password: ...}}
    const user = await User.findById(userOneId);

    expect(user).not.toBeNull();
    expect(user.password).not.toBe('testers1');
  });

  test('Should be login user', async () => {
    const response = await request(app)
      .post(`${API}/auth/login`)
      .send({
        username: userOne.username,
        email: userOne.email,
        password: userOne.password,
      })
      .expect(200);

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
  });

  test('Should be login user fail', async () => {
    await request(app)
      .post(`${API}/auth/login`)
      .send({
        username: userOne.username,
        email: userOne.email,
        password: 'wrongpassword',
      })
      .expect(400);
  });
});

describe('Test User API /users', () => {
  test('Should get user profile', async () => {
    await request(app)
      .get(`${API}/users/me`)
      .send()
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .expect(200);
  });

  test('Should not get user profile for unauthorization', async () => {
    await request(app).get(`${API}/users/me`).send().expect(401);
  });

  test('Should update user profile', async () => {
    const response = await request(app)
      .patch(`${API}/users/me`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        username: 'vannguyen',
      })
      .expect(200);

    const user = await User.findById(userOneId);
    expect(user.username).toEqual('vannguyen');
  });

  test('Should update user profile for unauthorization', async () => {
    const response = await request(app)
      .patch(`${API}/users/me`)
      .send({
        username: 'vannguyen',
      })
      .expect(401);
  });

  test('Should not get user profile for unauthorization', async () => {
    await request(app).get(`${API}/users/me`).send().expect(401);
  });

  test('Should delete account', async () => {
    const response = await request(app)
      .delete(`${API}/users/me`)
      .send()
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .expect(204);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
  });

  test('Should not delete account for unauthorization', async () => {
    await request(app).delete(`${API}/users/me`).send().expect(401);
  });
});
