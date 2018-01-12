const Articles = require('../models/articles');

exports.getTopicArticles = (req, res, next) => {
  const chosenTopic = req.params.topic_id;
  Articles.find({
    belongs_to: chosenTopic
  }) 
  .then((articles) => {
    if (articles.length < 1) {
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
    res.send({articles});
  })
  .catch(next);
};