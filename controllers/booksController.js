const pool = require('../models/db'); // PostgreSQL холболт тохиргоо

// Бүх номын мэдээлэл авах
exports.getAllBooks = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM book');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Шинэ ном нэмэх
exports.addBook = async (req, res) => {
    const { bookId, userId, userName, name, author, pubDate, price, image, commentCount, viewCount, paid } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO book (bookId, userId, userName, name, author, pubDate, price, image, commentCount, viewCount, paid, rating, userImage) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
            RETURNING *`,
            [bookId, userId, userName, name, author, pubDate, price, image, commentCount, viewCount, paid, rating, userImage]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ID-аар ном авах
exports.getBookById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM book WHERE bookId = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ном шинэчлэх
exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { name, author, pubDate, price, image, commentCount, viewCount, paid, rating, userImage } = req.body;

    try {
        const result = await pool.query(
            `UPDATE book 
            SET name = $1, author = $2, pubDate = $3, price = $4, image = $5, commentCount = $6, viewCount = $7, paid = $8, rating = $9, userImage = $10
            WHERE bookId = $11 
            RETURNING *`,
            [name, author, pubDate, price, image, commentCount, viewCount, paid, rating, userImage, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ном устгах
exports.deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM book WHERE bookId = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully', book: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    // Сагсанд ном нэмэх
exports.addToBasket = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Номын мэдээллийг book хүснэгтээс авах
        const bookResult = await pool.query('SELECT * FROM book WHERE "bookId" = $1', [id]);

        if (bookResult.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const book = bookResult.rows[0];

        // 2. Basket хүснэгтэд нэмэх
        const insertBasket = await pool.query(
            `INSERT INTO basket (bookId, userId, userName, name, author, pubDate, price, image, commentCount, viewCount, paid, rating, userImage) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
             RETURNING *`,
            [
                book.bookId, book.userId, book.userName, book.name, book.author, 
                book.pubDate, book.price, book.image, book.commentCount, 
                book.viewCount, book.paid, book.rating, book.userImage
            ]
        );

        // 3. Book хүснэгтээс тухайн номыг устгах
        await pool.query('DELETE FROM book WHERE "bookId" = $1', [id]);

        res.status(201).json({ message: 'Book added to basket and removed from book table', basket: insertBasket.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
};
