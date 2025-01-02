const pool = require('../models/db'); // PostgreSQL холболт тохиргоо

exports.getAllBlogs = async (req, res) => {
    try {
      console.log("Attempting to fetch blogs...");
      const result = await pool.query('SELECT * FROM blog');
      console.log("Fetched blogs:", result.rows);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Database query failed:", error);
      res.status(500).json({ error: "Failed to fetch blog", details: error.message });
    }
  };
  

exports.addBlog = async (req, res) => {
    const { id, userId, userName, name, description, date, image, commentCount, viewCount, bookmarkCheck} = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO blog (id, userId, userName, name, description, date, image, commentCount, viewCount, bookmarkCheck) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
            [id, userId, userName, name, description, date, image, commentCount, viewCount, bookmarkCheck]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBlogById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM blog WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBlog = async (req, res) => {
    const { id } = req.params;
    const { userId, userName, name, description, date, image, commentCount, viewCount, bookmarkCheck } = req.body;

    try {
        const result = await pool.query(
            `UPDATE blog 
            SET userId = $1, userName = $2, name = $3, description = $4, date = $5, image = $6, commentCount = $7, viewCount = $8, bookmarkCheck = $9
            WHERE id = $11 
            RETURNING *`,
            [userId, userName, name, description, date, image, commentCount, viewCount, bookmarkCheck, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM blog WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully', blog: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
