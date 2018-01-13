const Comments = require('../models/comments');

exports.getArticleComments = (req, res, next) => {
  const article_id = req.params.article_id;

  Comments.find({
    belongs_to : article_id
  })
  .then((comments) => {
    res.send({comments});
  })
  .catch(next);
};

exports.addArticleComments = (req, res, next) => {
  const belongs_to = req.params.article_id;
  const body = req.body.body;

  const createComment = new Comments({
    belongs_to,
    body
  });
  createComment.save()
  .then((comment) => {
    res.send({comment});
  })
  .catch(next);
};
