const Articles = require('../models/articles');

exports.getTopicArticles = (req, res, next) => {
  const {topic_id} = req.params;
  Articles.find({
      belongs_to: topic_id
    })
    .then((articles) => {
      if (!articles.length) {
        return next({
          status: 404,
          msg: `No articles found for topic with ${topic_id}`
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
      if (!articles) {
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
  const {article_id} = req.params;

  Articles.findById(article_id)
    .then((article) => {
      if (!article) {
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

  const {article_id} = req.params;
  const {vote} = req.query;

  if (vote !== 'up' && vote !== 'down') {
    return res.status(404).json({
      message: 'input not recognised'
    });
  }

  Articles.findById(article_id)
    .then(() => {
      let addOrMinus = vote === 'up' ? 1 : -1;
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
      next(err);
    });
};