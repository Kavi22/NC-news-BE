const express = require('express');
const {getUsers, getAllUsers} = require('../controllers/users');
const {getUserArticles} = require('../controllers/articles');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:username', getUsers);
router.get('/:username/articles', getUserArticles);


exports.usersRouter = router;