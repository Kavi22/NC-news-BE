const Users = require('../models/users');

exports.getAllUsers = (req, res, next) => {
  Users.find({})
    .then((users) => {
      res.send({
        users
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
const {username} = req.params;

  Users.findOne({
      username
    })
    .then((user) => {
      if (!user) {
        return next({
          status: 404,
          msg: `Username, ${username}, is not been used by anyone.`
        });
      }
      res.send({
        user
      });
    })
    .catch((err) => {
      next(err);
    });
};