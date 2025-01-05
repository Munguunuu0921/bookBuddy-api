const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketController');

// POST: Add a book to the basket
router.post('/', basketController.addToBasket);

// GET: Get all items in the basket
router.get('/', basketController.getBasketItems);

// DELETE: Remove a book from the basket by bookId
router.delete('/:bookId', basketController.removeFromBasket);

module.exports = router;
