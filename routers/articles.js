const express = require('express');
const {getAllArticles} = require('../controllers/articles');
const router = express.Router();

router.get('/', getAllArticles);

exports.articlesRouter = router;