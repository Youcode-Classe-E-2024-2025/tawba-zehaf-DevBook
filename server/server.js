// const express = require('express');
// const path = require('path');

// const app = express(); // ✅ D'abord, on initialise express

// // Import des routes
// const authRoutes = require(path.resolve(__dirname, '../routes/auth.routes'));

// // Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '../public')));

// // Routes API
// app.use('/auth', authRoutes);

// // Routes vers les vues HTML
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'index.html'));
// });

// app.get('/books', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'books.html'));
// });

// app.get('/categories', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'categories.html'));
// });

// app.get('/users', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'users.html'));
// });

// app.get('/borrows', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'borrows.html'));
// });

// app.get('/stats', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'stats.html'));
// });

// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'login.html'));
// });

// app.get('/signup', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'signup.html'));
// });

// // Lancement du serveur
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`✅ DevBook disponible sur http://localhost:${PORT}`);
// });
require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'assets')));

const usersRoute = require('../routes/user.routes');
const authRoute = require('../routes/auth.routes');
const booksRoute = require('../routes/book.routes');
const categoriesRoute = require('../routes/category.routes');
const empruntsRoute = require('../routes/borrow.routes');
const statsRoute = require('../routes/stats.routes');

app.use('/users', usersRoute);
app.use('/auth', authRoute);
app.use('/books', booksRoute);
app.use('/categories', categoriesRoute);
app.use('/emprunts', empruntsRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`node server is running on port ${port}`);

})