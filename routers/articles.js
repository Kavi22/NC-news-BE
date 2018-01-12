const express = require('express');
const {getAllArticles} = require('../controllers/articles');
const {getArticleComments} = require('../controllers/comments');
const router = express.Router();

router.get('/', getAllArticles);
router.get('/:article_id/comments', getArticleComments);

exports.articlesRouter = router;