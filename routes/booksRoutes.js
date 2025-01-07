const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController'); // Controller файлыг зөв оруулсан эсэхийг шалгаарай

// Books маршрутууд
router.get('/', booksController.getAllBooks); // Бүх номын мэдээлэл авах
router.post('/', booksController.addBook); // Шинэ ном нэмэх
router.get('/:id', booksController.getBookById); // ID-аар ном авах
router.put('/:id', booksController.updateBook); // Ном шинэчлэх
router.delete('/:id', booksController.deleteBook); // Ном устгах

router.put('/add-to-basket/:id', booksController.addToBasket); // Номыг сагс руу нэмэх

module.exports = router;
