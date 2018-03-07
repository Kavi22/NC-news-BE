const Comments = require('../models/comments');

exports.getArticleComments = (req, res, next) => {
  const {article_id} = req.params;

  Comments.find({
      belongs_to: article_id
    })
    .then((comments) => {
      if (!comments.length) {
        return next({
          status: 404,
          msg: `Article id ${article_id} has no comments`
        });
      }
      res.send({
        comments
      });
    })
    .catch((err) => {
      next(err);
    });
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
      res.send({
        comment
      });
    })
    .catch(next);
};

exports.increaseDecreaseCommentVotes = (req, res, next) => {
  const {comment_id} = req.params;
  const {vote} = req.query;

  if (vote !== 'up' && vote !== 'down') {
    return res.status(404).json({
      message: 'input not recognised'
    });
  }

  Comments.findById(comment_id)
    .then(() => {
      let addOrMinus = vote === 'up' ? 1 : -1;
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
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const {comment_id} = req.params;

  Comments.findByIdAndRemove(comment_id)
    .then((comment) => {
      res.send({
        comment,
        msg: 'Comment deleted successfully!'
      });
    })
    .catch((err) => {
      next(err);
    });
};