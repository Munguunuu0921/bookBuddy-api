const pool = require('../models/db'); // PostgreSQL connection setup

// Fetch all books
exports.getAllBooks = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM book');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to fetch books. Please try again later.' });
    }
};

// Add a new book
exports.addBook = async (req, res) => {
    const { bookId, userId, userName, name, author, pubDate, price, image, commentCount = 0, viewCount = 0, paid = false, rating = 0, userImage } = req.body;
    if (!name || !author || !price || !pubDate) {
        return res.status(400).json({ error: 'Missing required fields: name, author, price, or pubDate.' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO "book" ("bookId", "userId", "userName", "name", "author", "pubDate", "price", "image", "commentCount", "viewCount", "paid", "rating", "userImage")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
             RETURNING *`,
            [bookId, userId, userName, name, author, pubDate, price, image, commentCount, viewCount, paid, rating, userImage]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Failed to add book. Please try again later.' });
    }
};

// Get a book by ID
exports.getBookById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM "book" WHERE "bookId" = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching book by ID:', error);
        res.status(500).json({ error: 'Failed to fetch book. Please try again later.' });
    }
};

// Update a book
exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { name, author, pubDate, price, image, commentCount, viewCount, paid, rating, userImage } = req.body;

    try {
        const result = await pool.query(
            `UPDATE "book" 
             SET "name" = $1, "author" = $2, "pubDate" = $3, "price" = $4, "image" = $5, "commentCount" = $6, "viewCount" = $7, "paid" = $8, "rating" = $9, "userImage" = $10
             WHERE "bookId" = $11 
             RETURNING *`,
            [name, author, pubDate, price, image, commentCount, viewCount, paid, rating, userImage, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Failed to update book. Please try again later.' });
    }
};

// Delete a book
exports.deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM "book" WHERE "bookId" = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found.' });
        }
        res.status(200).json({ message: 'Book deleted successfully.', book: result.rows[0] });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Failed to delete book. Please try again later.' });
    }
};

// Add a book to the basket
exports.addToBasket = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('BEGIN'); // Start transaction

        // Fetch book details
        const bookResult = await pool.query('SELECT * FROM "book" WHERE "bookId" = $1', [id]);

        if (bookResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: 'Book not found.' });
        }

        const book = bookResult.rows[0];

        // Insert into basket table
        const insertBasket = await pool.query(
            `INSERT INTO "basket" ("bookId", "userId", "userName", "name", "author", "pubDate", "price", "image", "commentCount", "viewCount", "paid", "rating", "userImage") 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
             RETURNING *`,
            [
                book.bookId, book.userId, book.userName, book.name, book.author, 
                book.pubDate, book.price, book.image, book.commentCount, 
                book.viewCount, book.paid, book.rating, book.userImage
            ]
        );

        // Remove from book table
        await pool.query('DELETE FROM "book" WHERE "bookId" = $1', [id]);

        await pool.query('COMMIT'); // Commit transaction
        res.status(201).json({ message: 'Book added to basket and removed from book table.', basket: insertBasket.rows[0] });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error adding book to basket:', error);
        res.status(500).json({ error: 'Failed to add book to basket. Please try again later.' });
    }
};
