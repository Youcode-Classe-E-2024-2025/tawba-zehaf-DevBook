require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));

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