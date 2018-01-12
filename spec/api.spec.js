process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const saveTestData = require('../seed/test.seed');
mongoose.Promise = global.Promise;

describe('API', () => {
  // let usefulData;
  beforeEach(() => {
   return  mongoose.connection.dropDatabase()
      .then(saveTestData)
      .then(() => {
       // usefulData = data;
      })
      .catch();
  });

  describe('GET /', () => {
    it('responds with status code 200', () =>  {
      return request(server)
        .get('/')
        .then(res => {
            expect(res.status).to.equal(200);
        });
    });
  });

  // with callbacks
  // describe('GET /topics', function () {
  //   it('responds with status 200', function (done) {
  //     return request(server)
  //       .get('/api/topics')
  //       .end((err, res) => {
  //         if (err) done(err);
  //         else {
  //           expect(res.status).to.equal(200);
  //           done();
  //         }
  //       });
  //   });
  // });

  // with  promises
   describe('GET /topics',  () => {
    it('responds with all the topics', () => {
      return request(server)
        .get('/api/topics')
        .then(res => {
            expect(200);
            expect(res.body.topics.length).to.equal(3);
            expect(res.body.topics[0].title).to.be.oneOf(['Football', 'Cooking', 'Cats']);
        });
    }); 
  });

  describe('GET /topics/cat/articles',  () => {
    it('responds with all the articles for selected topic', () => {
      return request(server)
        .get('/api/topics/cats/articles')
        .then(res => {
            expect(200);
            expect(res.body.articles[0].belongs_to).to.equal('cats');
        });
    }); 
  });

  describe('GET /articles',  () => {
    it('responds with all the articles', () => {
      return request(server)
        .get('/api/articles')
        .then(res => {
          console.log(res.body.articles);
            expect(200);
            expect(res.body.articles.length).to.equal(2);
            expect(res.body.articles[0].title).to.equal('Cats are great');
        });
    }); 
  });
});