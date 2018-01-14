const Users = require('../models/users');

exports.getUsers = (req, res, next) => {
  const userName = req.params.username;
  Users.findOne({
      username: userName
    })
    .then((user) => {
      res.send({
        user
      });
    })
    .catch(next);
};