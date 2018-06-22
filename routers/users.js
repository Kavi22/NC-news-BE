const express = require('express');
const {getUsers, getAllUsers} = require('../controllers/users');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:username', getUsers);

exports.usersRouter = router;