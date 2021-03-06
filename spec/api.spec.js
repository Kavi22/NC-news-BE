process.env.NODE_ENV = 'test';
const {
  expect
} = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const saveTestData = require('../seed/test.seed');

mongoose.Promise = global.Promise;

describe('API', () => {
  beforeEach(() => {
    return mongoose.connection.dropDatabase()
      .then(saveTestData)
      .then(() => {
      })
      .catch();
  });

  describe('GET /', () => {
    it('responds with status code 200', () => {
      return request(server)
        .get('/')
        .then(res => {
          expect(res.status).to.equal(200);
        });
    });
  });

});