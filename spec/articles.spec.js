process.env.NODE_ENV = 'test';
const {
  expect
} = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const saveTestData = require('../seed/test.seed');

mongoose.Promise = global.Promise;

describe('API/ARTICLES', () => {
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
    describe('GET /', () => {
      it('responds with all the articles', () => {
        const article_title = usefulData.articles[0].title;
        return request(server)
          .get('/api/articles')
          .expect(200)
          .then(res => {
            expect(res.body.articles.length).to.equal(2);
            expect(res.body.articles[0].title).to.equal(article_title);
          });
      });
    });

    // TODO: check why the last expect needs to be a template literal?
    describe('GET /articles/article_id', () => {
      it('responds with  the selected article', () => {
        const article_id = usefulData.articles[0]._id;
        return request(server)
          .get(`/api/articles/${article_id}`)
          .expect(200)
          .then(res => {
            expect(res.body.article._id).to.equal(`${article_id}`);
          });
      });
    });

    describe('GET /articles/article_id/comments', () => {
      it('responds with all the comments for selected article', () => {
        const article_id = usefulData.articles[0]._id;
        const comment_body = usefulData.comments[0].body;
        return request(server)
          .get(`/api/articles/${article_id}/comments`)
          .expect(200)
          .then(res => {
            expect(res.body.comments[0].body).to.equal(comment_body);
          });
      });
      it('responds with 400 when incorrect article id has been passed', () => {
        return request(server)
          .get(`/api/articles/1/comments`)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('Invalid id');
          });
      });
    });
  });

  describe('POST /articles/article_id/comments', () => {
    it('successfully posts a new comment to the selected article', () => {
      const article_id = usefulData.articles[0]._id;
      return request(server)
        .post(`/api/articles/${article_id}/comments`)
        .expect(200)
        .send({
          body: 'testing 123'
        })
        .then(res => {
          expect(res.body.comment.body).to.equal('testing 123');
          return request(server)
            .get(`/api/articles/${article_id}/comments`)
            .expect(200);
        })
        .then(res => {
          expect(res.body.comments.length).to.equal(3);
        });
    });
  });

  describe('PUT /articles/:article_id', () => {
    it('successfully increments votes on selected  article', () => {
      const article_id = usefulData.articles[0]._id;
      const old_vote = usefulData.articles[0].votes;
      return request(server)
        .put(`/api/articles/${article_id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(old_vote + 1);
          return request(server)
            .get(`/api/articles/${article_id}`)
            .expect(200);
        })
        .then(res => {
          expect(res.body.article.votes).to.equal(old_vote + 1);
        });
    });

    it('successfully decrements votes on selected  article', () => {
      const article_id = usefulData.articles[0]._id;
      const old_vote = usefulData.articles[0].votes;
      return request(server)
        .put(`/api/articles/${article_id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(old_vote - 1);
          return request(server)
            .get(`/api/articles/${article_id}`)
            .expect(200);
        })
        .then(res => {
          expect(res.body.article.votes).to.equal(old_vote - 1);
        });
    });

    it('successfully handles bad user input', () => {
      const article_id = usefulData.articles[0]._id;
      return request(server)
        .put(`/api/articles/${article_id}?vote=test`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('input not recognised');
        });
    });
  });

});