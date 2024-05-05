const express = require('express');

const fileController = require('../controllers/fileController');

const router = express.Router();

//personal client register
// router.get('/test1', testController.test_get);

// send chunks from file server
router.post('/send-chunk', fileController.sendChunk);

// get chunks from file server
router.get('/get-chunk', fileController.getChunk);

module.exports = router;