const async = require('async');

const models = require('../models/models');

const topics = [
  { title: 'Football', slug: 'football' },
  { title: 'Cooking', slug: 'cooking' },
  { title: 'Cats', slug: 'cats' }
];

const articles = [
  { title: 'Cats are great', body: 'something', belongs_to: 'cats' },
  { title: 'Football is fun', body: 'something', belongs_to: 'football' }
];

const user = {
  username: 'northcoder',
  name: 'Awesome Northcoder',
  avatar_url: 'https://avatars3.githubusercontent.com/u/6791502?v=3&s=200'
};

function saveUser(cb) {
  models.Users.create(user, (err) => {
    if (err) cb(err);
    else cb();
  });
}

function saveTopics(cb) {
  models.Topics.create(topics, (err) => {
    if (err) cb(err);
    else cb();
  });
}

function saveArticles(cb) {
  models.Articles.create(articles, (err, docs) => {
    if (err) cb(err);
    else cb(null, docs);
  });
}

function saveComments(articlesArray, cb) {
  const articleId = articlesArray[0]._id;
  const comment = { body: 'this is a comment', belongs_to: articleId, created_by: 'northcoder' };
  const comment2 = { body: 'this is another comment', belongs_to: articleId, created_by: 'northcoder' };
  models.Comments.create([comment, comment2], err => {
    if (err) cb(err);
    else cb(null, { article_id: articleId, comment_id: comment._id, non_northcoder_comment: comment2._id });
  });
}

function saveTestData(DB, cb) {
    async.waterfall([saveUser, saveTopics, saveArticles, saveComments], (err, ids) => {
      if (err) cb(err);
      else {
        console.log('Test data seeded successfully.');
        cb(null, ids);
      }
    });
}

module.exports = saveTestData;