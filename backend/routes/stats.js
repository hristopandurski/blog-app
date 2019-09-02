const express = require('express');

const StatsController = require('../controllers/stats');

const router = express.Router();

router.post('/createStats', StatsController.createStats);

router.patch('/updateStats', StatsController.updateStats);

router.get('/getStats', StatsController.getStats);

module.exports = router;