process.env.NODE_ENV = 'test';
const {
  expect
} = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const saveTestData = require('../seed/test.seed');

mongoose.Promise = global.Promise;

describe('API/USERS', () => {
  let usefulData;
  beforeEach(() => {
    return mongoose.connection.dropDatabase()
      .then(saveTestData)
      .then((data) => {
        usefulData = data;
      })
      .catch();
  });

  describe('GET /users/:username', () => {
    it('responds with profile info for selected user', () => {
      const username = usefulData.user.username;
      return request(server)
        .get(`/api/users/${username}`)
        .expect(200)
        .then(res => {
          expect(res.body.user.username).to.equal(username);
        });
    });
  });

});