const express = require('express');
const {topicsRouter} = require('./topics');
const {articlesRouter} = require('./articles');
const router = express.Router();

router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);

exports.apiRouter = router;