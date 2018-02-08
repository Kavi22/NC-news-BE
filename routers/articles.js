const express = require('express');
const {getArticle, getAllArticles, increaseDecreaseArticleVotes} = require('../controllers/articles');
const {getArticleComments, addArticleComments} = require('../controllers/comments');
const {validateArticleId} = require('../middleware/validateId');
const router = express.Router();

router.get('/', getAllArticles);
router.get('/:article_id', validateArticleId, getArticle);

router.get('/:article_id/comments', validateArticleId, getArticleComments);

router.post('/:article_id/comments', validateArticleId, addArticleComments);

router.put('/:article_id', validateArticleId, increaseDecreaseArticleVotes);

exports.articlesRouter = router;