// controllers/basketController.js
const pool = require('../models/db.js');

exports.addToBasket = async (req, res) => {
    const {
        bookId, userId, userName, name, author, pubDate, price, image, commentCount, viewCount, paid, rating, userImage
    } = req.body;

    if (!bookId || !userId || !name || !author || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // 1. Add to basket
        const insertQuery = `
            INSERT INTO "basket" 
            ("bookId", "userId", "userName", "name", "author", "pubDate", "price", "image", "commentCount", "viewCount", "paid", "rating", "userImage")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `;
        await pool.query(insertQuery, [
            bookId, userId, userName, name, author, pubDate, price, image, commentCount, viewCount, paid, rating, userImage
        ]);

        // 2. Remove book from the books table
        const deleteQuery = 'DELETE FROM "book" WHERE "bookId" = $1';
        await pool.query(deleteQuery, [bookId]);

        res.status(201).send({ message: 'Book successfully added to basket and removed from book table.' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to add book to basket.' });
    }
};

exports.getBasketItems = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "basket"');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching basket items:', error);
        res.status(500).json({ error: 'Failed to fetch basket items.' });
    }
};

exports.removeFromBasket = async (req, res) => {
    const { bookId } = req.params;

    if (!bookId) {
        return res.status(400).json({ error: 'Book ID is required' });
    }

    try {
        const deleteQuery = 'DELETE FROM "basket" WHERE "bookId" = $1';
        const result = await pool.query(deleteQuery, [bookId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Book not found in the basket.' });
        }

        res.status(200).send({ message: 'Book removed from basket successfully.' });
    } catch (error) {
        console.error('Error removing book from basket:', error);
        res.status(500).json({ error: 'Failed to remove book from basket.' });
    }
};
