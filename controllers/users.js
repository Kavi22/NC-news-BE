const Users = require('../models/users');
const Articles = require('../models/articles');

exports.getAllUsers = (req, res, next) => {
  Users.find({})
    .then((users) => {
      if(!users) {
        return next({
            status: 404,
            msg: 'No users found'
        });
      }
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

Promise.all([Users.findOne({username}), Articles.find({created_by: username})])
.then(results => {
    const [user, articles] = results;

    if (!user) {
        return next({
            status: 404,
            msg: `Username, ${username}, is not been used by anyone.`
        });
    }
      res.send({
          user,
          articles
      })
})
    .catch(err => {
      next(err);
    })
};
