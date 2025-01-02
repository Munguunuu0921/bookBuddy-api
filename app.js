require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importing cors module
const swaggerUi = require('swagger-ui-express');
const booksRoutes = require('./routes/booksRoutes');
const usersRoutes = require('./routes/usersRoutes');
const blogsRoutes = require('./routes/blogsRoutes'); // Import blogs routes
const swaggerDocument = require('./swagger/swagger.json');

// Initialize the express app
const app = express();

// Use cors after app initialization
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Basic route to check server status
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Routes
app.use('/api/books', booksRoutes); // Existing books routes
app.use('/api/users', usersRoutes);
app.use('/api/blogs', blogsRoutes); // Add blogs routes

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
