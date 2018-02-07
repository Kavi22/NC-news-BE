const Articles = require('../models/articles');

exports.getTopicArticles = (req, res, next) => {
  const chosenTopic = req.params.topic_id;
  Articles.find({
      belongs_to: chosenTopic
    })
    .then((articles) => {
      if (!articles.length) {
        return next({
          status: 404,
          msg: 'No Articles Found'
        });
      }
      res.send({
        articles
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  Articles.find({})
    .then((articles) => {
      if (!articles.length) {
        return next({
          status: 404,
          msg: 'No Articles Found'
        });
      }
      res.send({
        articles
      });
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  const chosenArticle = req.params.article_id;
  Articles.find({
      _id: chosenArticle
    })
    .then((article) => {
      if (!article.length) {
        return next({
          status: 404,
          msg: 'No Article Found'
        });
      }
      res.send({
        article
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.increaseDecreaseArticleVotes = (req, res, next) => {

  const article_id = req.params.article_id;
  const query = req.query.vote;

  if (query !== 'up' && query !== 'down') {
    return res.status(404).json({
      message: 'input not recognised'
    });
  }

  Articles.findById(article_id)
    .then(() => {
      let addOrMinus = query === 'up' ? 1 : -1;
      return Articles.findByIdAndUpdate(article_id, {
        $inc: {
          votes: addOrMinus
        }
      }, {
        new: true
      });
    })
    .then((article) => {
      res.send({
        article
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') return next({
        err,
        status: 400,
        msg: 'Invalid ID'
      });
      next(err);
    });
};