const express = require('express');
const {getTopics} = require('../controllers/topics');
const {getTopicArticles} = require('../controllers/articles');
const router = express.Router();

router.get('/', getTopics);
router.get('/:topic_id/articles', getTopicArticles);

exports.topicsRouter = router;