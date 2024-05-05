const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

// send chunks from file server
router.post('/save-chunk', fileController.saveChunk);

// get chunks from file server
router.get('/get-chunk', fileController.getChunk);

module.exports = router;