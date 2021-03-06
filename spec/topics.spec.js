process.env.NODE_ENV = 'test';
const {
  expect
} = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const saveTestData = require('../seed/test.seed');

mongoose.Promise = global.Promise;

describe('API/TOPICS', () => {
  let usefulData;
  beforeEach(() => {
    return mongoose.connection.dropDatabase()
      .then(saveTestData)
      .then((data) => {
        usefulData = data;
      })
      .catch();
  });

  describe('ALL GET REQUESTS', () => {
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
    describe('GET /topics', () => {
      it('returns 200 and responds with all the topics', () => {
        return request(server)
          .get('/api/topics')
          .expect(200)
          .then(res => {
            expect(res.body.topics.length).to.equal(3);
            res.body.topics.forEach(topic => {
              expect(topic.title).to.be.a('string');
              expect(topic.slug).to.be.a('string');
              expect(topic.slug).to.equal(topic.title.toLowerCase());
            });
          });
      });
    });

    describe('GET /topics/topic_id/articles', () => {
      it('returns 200 and responds with all the articles for selected topic', () => {
        const topic = usefulData.topics[0].slug;
        return request(server)
          .get(`/api/topics/${topic}/articles`)
          .expect(200)
          .then(res => {
            res.body.articles.forEach(article => {
              expect(article.belongs_to).to.equal(topic);
              expect(article.title).to.be.a('string');
              expect(article.body).to.be.a('string');
              expect(article.votes).to.be.a('number');
            });
          });
      });
      it('returns 404 when invalid topic has been passed', () => {
        const topic = 'batman';
        return request (server)
          .get(`/api/topics/${topic}/articles`)
          .expect(404)
          .then(res => {
            expect(res.status).to.equal(404);
            expect(res.body.msg).to.equal(`No articles found for topic with ${topic}`);
          });
      });
      it('returns topics sorted by title', () => {
        return request (server)
          .get('/api/topics')
          .expect(200)
          .then(res => {
            expect(res.body.topics[0].title).to.equal('Cats');
            expect(res.body.topics[1].title).to.equal('Cooking');
            expect(res.body.topics[2].title).to.equal('Football');
          });
      });
    });
  });
});