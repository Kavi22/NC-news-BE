const Comments = require('../models/comments');

exports.getArticleComments = (req, res, next) => {
  const article_id = req.params.article_id;

  Comments.findOne({
    belongs_to : article_id
  })
  .then((comments) => {
    res.send({comments});
  })
  .catch(next);
};