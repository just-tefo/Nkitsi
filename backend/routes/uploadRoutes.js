const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controllers/uploadController');

const router = express.Router();

// use memory storage so we can forward buffer to S3
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload -> accept single file field "file"
router.post('/', upload.single('file'), uploadFile);

module.exports = router;
