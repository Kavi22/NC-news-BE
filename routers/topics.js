const express = require('express');
const {getTopics} = require('../controller/topics');
const router = express.Router();

router.get('/', getTopics);

exports.topicsRouter = router;