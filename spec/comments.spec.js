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
    it('successfully increments votes on selected comment', () => {
      const comment_id = usefulData.comments[0]._id;
      const old_vote = usefulData.comments[0].votes;
      const article_id = usefulData.articles[0]._id;
      return request(server)
        .put(`/api/comments/${comment_id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(old_vote + 1);
          return request(server)
          .get(`/api/articles/${article_id}/comments`)
          .expect(200);
        })
        .then(res => {
          expect(res.body.comments[0].votes).to.equal(old_vote + 1);
        });
    });

    it('successfully decrements votes on a selected comment', () => {
      const comment_id = usefulData.comments[0]._id;
      const old_vote = usefulData.comments[0].votes;
      const article_id = usefulData.articles[0]._id;
      return request(server)
        .put(`/api/comments/${comment_id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(old_vote - 1);
          return request(server)
          .get(`/api/articles/${article_id}/comments`)
          .expect(200);
        })
        .then(res => {
          expect(res.body.comments[0].votes).to.equal(old_vote - 1);
        });
    });

    it('successfully handles bad user input', () => {
      const comment_id = usefulData.comments[0]._id;
      return request(server)
        .put(`/api/articles/${comment_id}?vote=test`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('input not recognised');
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