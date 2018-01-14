const express = require('express');
const {increaseDecreaseCommentVotes, deleteComment} = require('../controllers/comments');
const router = express.Router();

router.put('/:comment_id', increaseDecreaseCommentVotes);
router.delete('/:comment_id', deleteComment);

exports.commentsRouter = router;