const mongoose = require('mongoose');

function validateArticleId(req, res, next) {
  const { article_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(article_id)) {
    return next({
      status: 400,
      msg: 'Invalid id'
    });
  }
  next();

}

module.exports = {
  validateArticleId
};