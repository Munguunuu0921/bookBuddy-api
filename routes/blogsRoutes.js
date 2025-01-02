const express = require('express');
const { getAllBlogs } = require('../controllers/blogsController');

const router = express.Router();

// Route to fetch all blogs
router.get('/', getAllBlogs);

module.exports = router;
