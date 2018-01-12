const express = require('express');
const {topicsRouter} = require('./topics');

const router = express.Router();

router.use('/topics', topicsRouter);

exports.apiRouter = router;