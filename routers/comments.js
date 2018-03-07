const express = require('express');
const {increaseDecreaseCommentVotes, deleteComment} = require('../controllers/comments');
const {validateCommentId} = require('../middleware/validateId');
const router = express.Router();

router.put('/:comment_id', validateCommentId, increaseDecreaseCommentVotes);
router.delete('/:comment_id', validateCommentId, deleteComment);

exports.commentsRouter = router;