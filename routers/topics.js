const express = require('express');
const {getTopics} = require('../controllers/topics');
const {getTopicArticles} = require('../controllers/articles');
// const {validateTopicId} = require('../middleware/validateId');

const router = express.Router();

router.get('/', getTopics);
router.get('/:topic_id/articles', getTopicArticles);
// router.get('/:topic_id/articles', validateTopicId, getTopicArticles);

exports.topicsRouter = router;