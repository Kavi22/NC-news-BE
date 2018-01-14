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

exports.increaseDecreaseCommentVotes = (req, res, next) => {
  const comment_id = req.params.comment_id;
  const query = req.query.vote;

  Comments.findById(comment_id)
  .then(() => {
    let addOrMinus = query === 'up' ? 1 : -1;
    return Comments.findByIdAndUpdate(comment_id, { $inc: {votes: addOrMinus}}, {new: true});
  })
  .then((comment) => {
    res.send({comment});
  })
  .catch(next);
};