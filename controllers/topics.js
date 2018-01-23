const Topics = require('../models/topics');

exports.getTopics = (req, res, next) => {
  Topics.find({})
  .then((topics) => {
    if (!topics.length) {
      return next({
        status: 404,
        msg: 'No Topics Found'
      });
    }
    res.send({topics});
  })
  .catch(next);
};

