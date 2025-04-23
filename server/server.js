const express = require('express');
const path = require('path');
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Define routes for each view
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/books', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'books.html'));
});

app.get('/categories', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'categories.html'));
});

app.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'users.html'));
});

app.get('/borrows', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'borrows.html'));
});
app.get('/stats', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'stats.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ DevBook disponible sur http://localhost:${PORT}`);
});
