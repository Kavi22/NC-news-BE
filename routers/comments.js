const express = require('express');
const {increaseDecreaseCommentVotes} = require('../controllers/comments');
const router = express.Router();

router.put('/:comment_id', increaseDecreaseCommentVotes);

exports.commentsRouter = router;