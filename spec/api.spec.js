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
  let usefulData;
  beforeEach(() => {
    return mongoose.connection.dropDatabase()
      .then(saveTestData)
      .then((data) => {
        usefulData = data;
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

  describe('GET /topics/topic_id/articles', () => {
    it('responds with all the articles for selected topic', () => {
      return request(server)
        .get('/api/topics/cats/articles')
        .then(res => {
          expect(200);
          expect(res.body.articles[0].belongs_to).to.equal('cats');
        });
    });
  });

  describe('GET /articles', () => {
    it('responds with all the articles', () => {
      return request(server)
        .get('/api/articles')
        .then(res => {
          expect(200);
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0].title).to.be.oneOf(['Cats are great', 'Football is fun']);
        });
    });
  });

  describe('GET /articles/article_id/comments', () => {
    it('responds with all the comments for selected article', () => {
      const article_id = usefulData.articles[0]._id;
      return request(server)
        .get(`/api/articles/${article_id}/comments`)
        .then(res => {
          expect(200);
          expect(res.body.comments[0].body).to.be.oneOf(['this is a comment', 'this is another comment']);
        });
    });
  });

  describe('POST /articles/article_id/comments', () => {
    it('successfully posts a new comment to the selected article', () => {
      const article_id = usefulData.articles[0]._id;
      return request(server)
        .post(`/api/articles/${article_id}/comments`)
        .send({
          body: 'testing 123'
        })
        .then(res => {
          expect(200);
          expect(res.body.comment.body).to.equal('testing 123');
        });
    });
  });

  describe('PUT /articles/:article_id', () => {
    it('successfully increments votes on selected  article', () => {
      const article_id = usefulData.articles[0]._id;
      return request(server)
        .put(`/api/articles/${article_id}?vote=up`)
        .then(res => {
          expect(200);
          expect(res.body.article.votes).to.equal(1);
        });
    });

    it('successfully decrements votes on selected  article', () => {
      const article_id = usefulData.articles[0]._id;
      return request(server)
        .put(`/api/articles/${article_id}?vote=down`)
        .then(res => {
          expect(200);
          expect(res.body.article.votes).to.equal(-1);
        });
    });
  });

  describe('PUT /comments/:comment_id', () => {
    it('successfully increments votes on selected comment', () => {
      const comment_id = usefulData.comments[0]._id;
      return request(server)
        .put(`/api/comments/${comment_id}?vote=up`)
        .then(res => {
          expect(200);
          expect(res.body.comment.votes).to.equal(1);
        });
    });

    it('successfully decrements votes on a selected comment', () => {
      const comment_id = usefulData.comments[0]._id;
      return request(server)
        .put(`/api/comments/${comment_id}?vote=down`)
        .then(res => {
          expect(200);
          expect(res.body.comment.votes).to.equal(-1);
        });
    });
  });

  // TODO: need to figure out why this still shows both comments - not deleting from test database
  describe('DELETE /comments/:comment_id', () => {
    it('successfully deletes the selected comment', () => {
      const comment_id = usefulData.comments[0]._id;
      //  console.log(usefulData.comments);
      return request(server)
        .del(`/api/comments/${comment_id}`)
        .then(res => {
          expect(200);
          // console.log(usefulData.comments);
          expect(res.body.message).to.equal('Comment deleted successfully!');
        });
    });
  });

  describe('GET /users/:username', () => {
    it('responds with profile info for selected user', () => {
      const username = usefulData.user.username;
      return request(server)
        .get(`/api/users/${username}`)
        .then(res => {
          expect(200);
          expect(res.body.user.username).to.equal('northcoder');
        });
    });
  });
  
});