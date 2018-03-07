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
      it('returns 200 and responds with all the articles', () => {
        const articles_length = usefulData.articles.length;
        return request(server)
          .get('/api/articles')
          .expect(200)
          .then(res => {
            expect(res.body.articles.length).to.equal(articles_length);
            res.body.articles.forEach(article => {
              expect(article.title).to.be.a('string');
              expect(article.body).to.be.a('string');
              expect(article.belongs_to).to.be.a('string');
              expect(article.votes).to.be.a('number');
            });
          });
      });
    });

    describe('GET /articles/article_id', () => {
      it('returns 200 and responds with the selected article', () => {
        const { _id, title, body, votes } = usefulData.articles[0];
        return request(server)
          .get(`/api/articles/${_id}`)
          .expect(200)
          .then(res => {
            expect(res.body.article._id).to.equal(`${_id}`);
            expect(res.body.article.title).to.equal(title);
            expect(res.body.article.body).to.equal(body);
            expect(res.body.article.votes).to.equal(votes);
          });
      });
      it('returns 400 when incorrect article id has been passed', () => {
        const article_id = 1;
        return request(server)
          .get(`/api/articles/${article_id}`)
          .expect(400)
          .then(res => {
            expect(res.status).to.equal(400);
            expect(res.body.msg).to.equal('Invalid id');
          });
      });
    });

    describe('GET /articles/article_id/comments', () => {
      it('returns 200 and responds with all the comments for selected article', () => {
        const { _id } = usefulData.articles[0];
        const {body} = usefulData.comments[0];
        return request(server)
          .get(`/api/articles/${_id}/comments`)
          .expect(200)
          .then(res => {
            expect(res.body.comments[0].body).to.equal(body);
              res.body.comments.forEach(comment => {
              expect(comment.body).to.be.a('string');
              expect(comment.belongs_to).to.be.a('string');
              expect(comment.created_at).to.be.a('number');
              expect(comment.votes).to.be.a('number');
              expect(comment.created_by).to.be.a('string');
            });
          });
      });
      it('returns 400 when incorrect article id has been passed', () => {
        const article_id = 1;
        return request(server)
          .get(`/api/articles/${article_id}/comments`)
          .expect(400)
          .then(res => {
            expect(res.status).to.equal(400);
            expect(res.body.msg).to.equal('Invalid id');
          });
      });
      it('returns 404 when article has no comments', () => {
        const { _id } = usefulData.articles[1];
        return request (server)
          .get(`/api/articles/${_id}/comments`)
          .expect(404)
          .then(res => {
            expect(res.status).to.equal(404);
            expect(res.body.msg).to.equal(`Article id ${_id} has no comments`);
          });
      });
    });
  });

  describe('POST /articles/article_id/comments', () => {
    it('returns 200 and successfully posts a new comment to the selected article', () => {
      const { _id } = usefulData.articles[0];
      const prePostCommentCount = usefulData.comments.length;
      return request(server)
        .post(`/api/articles/${_id}/comments`)
        .expect(200)
        .send({
          body: 'testing 123'
        })
        .then(res => {
          expect(res.body.comment.body).to.equal('testing 123');
          return request(server)
            .get(`/api/articles/${_id}/comments`)
            .expect(200);
        })
        .then(res => {
          expect(res.body.comments.length).to.equal(prePostCommentCount + 1);
        });
    });
    
    it('returns 400 when incorrect article id has been passed', () => {
      const article_id = 1;
      return request(server)
        .post(`/api/articles/${article_id}/comments`)
        .expect(400)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body.msg).to.equal('Invalid id');
        });
    });
  });

  describe('PUT /articles/:article_id', () => {
    it('returns 200 and successfully increments votes on selected  article', () => {
      const {_id, title, body, votes} = usefulData.articles[0];
     
      return request(server)
        .put(`/api/articles/${_id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(votes + 1);
          return request(server)
            .get(`/api/articles/${_id}`)
            .expect(200);
        })
        .then(res => {
          expect(res.body.article.votes).to.equal(votes + 1);
          expect(res.body.article.title).to.equal(title);
          expect(res.body.article.body).to.equal(body);
        });
    });

    it('returns 200 and successfully decrements votes on selected  article', () => {
      const {_id, title, body, votes} = usefulData.articles[0];
      return request(server)
        .put(`/api/articles/${_id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(votes - 1);
          return request(server)
            .get(`/api/articles/${_id}`)
            .expect(200);
        })
        .then(res => {
          expect(res.body.article.votes).to.equal(votes - 1);
          expect(res.body.article.title).to.equal(title);
          expect(res.body.article.body).to.equal(body);
        });
    });

    it('returns 400 when incorrect article id has been passed', () => {
      const article_id = 1;
      return request(server)
        .put(`/api/articles/${article_id}/?vote=down`)
        .expect(400)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body.msg).to.equal('Invalid id');
        });
    });

    it('returns 404 when query is not "up" or "down"', () => {
      const {_id} = usefulData.articles[0];
      const test = 'test';
      return request(server)
        .put(`/api/articles/${_id}?vote=${test}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('input not recognised');
        });
    });
  });

});