const express = require('express');
const router = express.Router();
const { getAllLogsController, getLogByIdController } = require('../controllers/logController');

router.get('/', getAllLogsController);
router.get('/:id', getLogByIdController);

module.exports = router;
