process.env.NODE_ENV = 'test';
const {
  expect
} = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const saveTestData = require('../seed/test.seed');

mongoose.Promise = global.Promise;

describe('API/COMMENTS', () => {
  let usefulData;
  beforeEach(() => {
    return mongoose.connection.dropDatabase()
      .then(saveTestData)
      .then((data) => {
        usefulData = data;
      })
      .catch();
  });

  describe('PUT /comments/:comment_id', () => {
    it('returns 200 and successfully increments votes on selected comment', () => {
      const {_id,body, belongs_to, votes} = usefulData.comments[0];
      const article_id = usefulData.articles[0]._id;

      return request(server)
        .put(`/api/comments/${_id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(votes + 1);
          return request(server)
          .get(`/api/articles/${article_id}/comments`)
          .expect(200);
        })
        .then(res => {
          expect(res.body.comments[0].votes).to.equal(votes + 1);
          expect(res.body.comments[0].belongs_to).to.equal(`${belongs_to}`);
          expect(res.body.comments[0].body).to.equal(body);
        });
    });

    it('returns 200 and successfully decrements votes on a selected comment', () => {
      const {_id,body, belongs_to, votes} = usefulData.comments[0];
      const article_id = usefulData.articles[0]._id;

      return request(server)
        .put(`/api/comments/${_id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(votes - 1);
          return request(server)
          .get(`/api/articles/${article_id}/comments`)
          .expect(200);
        })
        .then(res => {
          expect(res.body.comments[0].votes).to.equal(votes - 1);
          expect(res.body.comments[0].belongs_to).to.equal(`${belongs_to}`);
          expect(res.body.comments[0].body).to.equal(body);
        });
    });

    it('returns 404 when query is not "up" or "down"', () => {
      const {_id} = usefulData.comments[0];
      const test = 'test';
      return request(server)
        .put(`/api/articles/${_id}?vote=${test}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('input not recognised');
        });
    });

    it('returns 400 when incorrect comment id has been passed', () => {
      const comment_id = 1;
      return request(server)
        .put(`/api/articles/${comment_id}/?vote=down`)
        .expect(400)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body.msg).to.equal(`Invalid article id : ${comment_id}`);
        });
    });
  });

  describe('DELETE /comments/:comment_id', () => {
    it('successfully deletes the selected comment from DB', () => {
      const comment_id = usefulData.comments[0]._id;
      const article_id = usefulData.comments[0].belongs_to;
      const comments = usefulData.comments.length;

      return request(server)
        .del(`/api/comments/${comment_id}`)
        .expect(200)
        .then(res => {
          expect(res.body.message).to.equal('Comment deleted successfully!');
          return request(server)
            .get(`/api/articles/${article_id}/comments`)
            .expect(200);
          })
          .then(res => {
            expect(res.body.comments.length).to.equal(comments - 1);
        });
    });
  });

});