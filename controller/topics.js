const Topics = require('../models/topics');

exports.getTopics = (req, res, next) => {
  Topics.find({})
  .then((topics) => {
    res.send({topics});
  })
  .catch(next);
};