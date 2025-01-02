const pool = require('../models/db'); // PostgreSQL холболт тохиргоо

exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addUser = async (req, res) => {
    const { id, name, email, phoneNumber, membership, image, age, address, bookCount,BlogCount, rating } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO users (id, name, email, phoneNumber, membership, image, age, address, bookCount, BlogCount, rating) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *`,
            [id, name, email, phoneNumber, membership, image, age, address, bookCount, BlogCount, rating]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, phoneNumber, membership, image, age, address, bookCount, BlogCount, rating } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
            SET name = $1, email = $2, phoneNumber = $3, membership = $4, image = $5, age = $6, address = $7, bookCount = $8, BlogCount = $9, rating = $10
            WHERE id = $11 
            RETURNING *`,
            [name, email, phoneNumber, membership, image, age, address, bookCount,BlogCount, rating, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', users: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
