const express = require('express');
const {topicsRouter} = require('./topics');
const {articlesRouter} = require('./articles');
const {commentsRouter} = require('./comments');
const router = express.Router();

router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);

exports.apiRouter = router;