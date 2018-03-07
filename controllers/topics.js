const Topics = require('../models/topics');

exports.getTopics = (req, res, next) => {
  Topics.find({})
  .sort({ title: 'asc'})

  .then((topics) => {
    if (!topics) {
      return next({
        status: 404,
        msg: 'No Topics Found'
      });
    }
    res.send({topics});
  })
  .catch((err) => {
    next(err);
  });
};