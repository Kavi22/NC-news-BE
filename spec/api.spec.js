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
      const topic = usefulData.topics[0].title;
      return request(server)
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics.length).to.equal(3);
          expect(res.body.topics[0].title).to.equal(topic);
        });
    });
  });

  describe('GET /topics/topic_id/articles', () => {
    it('responds with all the articles for selected topic', () => {
      const topic = usefulData.topics[0].slug;
      return request(server)
        .get(`/api/topics/${topic}/articles`)
        .expect(200)
        .then(res => {
          expect(res.body.articles[0].belongs_to).to.equal(topic);
        });
    });
  });

  describe('GET /articles', () => {
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

  describe('GET /articles/article_id', () => {
    it('responds with  the selected article', () => {
      const article_id = usefulData.articles[0]._id;
      return request(server)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(res => {
          expect(res.body.article.length).to.equal(1);
          expect(res.body.article[0]._id).to.equal(`${article_id}`);
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
          expect(res.body.msg).to.equal('Invalid Article ID');
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
      console.log(old_vote);
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
          expect(res.body.article[0].votes).to.equal(old_vote + 1);
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

  describe('PUT /comments/:comment_id', () => {
    it('successfully increments votes on selected comment', () => {
      const comment_id = usefulData.comments[0]._id;
      const old_vote = usefulData.comments[0].votes;
      // const article_id = usefulData.articles[0]._id;
      return request(server)
        .put(`/api/comments/${comment_id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(old_vote + 1);
          // return request(server)
          // .get(`/api/articles/${article_id}/comments`)
          // .expect(200);
        });
        // .then(res => {
        //   console.log(res.body.comments.votes);
        //   // expect(res.body.comments.votes)
        // });
    });

    it('successfully decrements votes on a selected comment', () => {
      const comment_id = usefulData.comments[0]._id;
      const old_vote = usefulData.comments[0].votes;
      return request(server)
        .put(`/api/comments/${comment_id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(old_vote - 1);
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