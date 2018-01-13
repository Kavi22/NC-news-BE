const Articles = require('../models/articles');

exports.getTopicArticles = (req, res, next) => {
  const chosenTopic = req.params.topic_id;
  Articles.find({
    belongs_to: chosenTopic
  }) 
  .then((articles) => {
    if (!articles.length) {
      return res.status(404).json({
        message: 'No Articles Found'
      });
    }
    res.send({articles});
  })
  .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  Articles.find({})
  .then((articles) => {
    if (!articles.length) {
      return res.send.status(404).json({
        message: 'No Articles Found'
      });
    }
    res.send({articles});
  })
  .catch(next);
};

exports.increaseDecreaseArticleVotes = (req, res, next) => {

  const article_id = req.params.article_id;
  const query = req.query.vote;
  Articles.findById(article_id)
    .then(() => {
      let addOrMinus = query === 'up' ? 1 : -1;
      return Articles.findByIdAndUpdate(article_id, { $inc: { votes: addOrMinus } }, { new: true });
    })
    .then((article) => {
      res.send({article});
     })
     .catch(next);
};