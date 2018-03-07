const mongoose = require('mongoose');

function validateArticleId(req, res, next) {
  const { article_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(article_id)) {
    return next({
      status: 400,
      msg: `Invalid article id : ${article_id}`
    });
  }
  next();
}

function validateCommentId(req, res, next) {
  const { comment_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(comment_id)) {
    return next({
      status: 400,
      msg: `Invalid article id : ${comment_id}`
    });
  }
  next();
}

// function validateTopicId(req, res, next) {
//   const { topic_id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(topic_id)) {
//     return next({
//       status: 400,
//       msg: `Invalid topic id : ${topic_id}`
//     });
//   }
//   next();

// }

module.exports = {
  validateArticleId,
  validateCommentId
  // validateTopicId
};