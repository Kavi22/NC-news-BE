const express = require('express');
const {getArticle, getAllArticles, increaseDecreaseArticleVotes} = require('../controllers/articles');
const {getArticleComments, addArticleComments} = require('../controllers/comments');
const router = express.Router();

router.get('/', getAllArticles);
router.get('/:article_id', getArticle);

router.get('/:article_id/comments', getArticleComments);

router.post('/:article_id/comments', addArticleComments);

router.put('/:article_id', increaseDecreaseArticleVotes);

exports.articlesRouter = router;