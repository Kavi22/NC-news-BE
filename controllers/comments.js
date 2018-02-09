const Comments = require('../models/comments');

exports.getArticleComments = (req, res, next) => {
  const article_id = req.params.article_id;

  Comments.find({
      belongs_to: article_id
    })
    .then((comments) => {
      res.send({
        comments
      });
    })
    .catch((err) => {
      next(err);
    });
};

// TODO: error  handling on entering a  message?

exports.addArticleComments = (req, res, next) => {
  const belongs_to = req.params.article_id;
  const body = req.body.body;

  const createComment = new Comments({
    belongs_to,
    body
  });
  createComment.save()
    .then((comment) => {
      res.send({
        comment
      });
    })
    .catch(next);
};

exports.increaseDecreaseCommentVotes = (req, res, next) => {
  const comment_id = req.params.comment_id;
  const query = req.query.vote;

  if (query !== 'up' && query !== 'down') {
    return res.status(404).json({
      message: 'input not recognised'
    });
  }

  Comments.findById(comment_id)
    .then(() => {
      let addOrMinus = query === 'up' ? 1 : -1;
      return Comments.findByIdAndUpdate(comment_id, {
        $inc: {
          votes: addOrMinus
        }
      }, {
        new: true
      });
    })
    .then((comment) => {
      res.send({
        comment
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') return next({
        err,
        status: 400,
        msg: 'Invalid Comment ID'
      });
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  Comments.findByIdAndRemove(comment_id)
    .then(() => {
      res.status(200).json({
        message: 'Comment deleted successfully!'
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') return next({
        err,
        status: 400,
        msg: 'Invalid Comment ID'
      });
      next(err);
    });
};