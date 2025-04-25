const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const Category = require('../models/Category');
const User = require('../models/User');

exports.getTopBooks = async (req, res) => {
  try {
    const month = req.query.month;
    const date = new Date(month);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const [borrows] = await Borrow.findAll();
    const filteredBorrows = borrows.filter(borrow => {
      const borrowDate = new Date(borrow.date_emprunt);
      return borrowDate >= startOfMonth && borrowDate <= endOfMonth;
    });

    const bookCounts = {};
    filteredBorrows.forEach(borrow => {
      bookCounts[borrow.livre_id] = (bookCounts[borrow.livre_id] || 0) + 1;
    });

    const [books] = await Book.findAll();
    const topBooks = Object.entries(bookCounts)
      .map(([bookId, count]) => ({
        book: books.find(b => b.id === parseInt(bookId)),
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json(topBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLateBooks = async (req, res) => {
  try {
    const today = new Date();
    const [borrows] = await Borrow.findAll();
    const [books] = await Book.findAll();

    const lateBorrows = borrows.filter(borrow => {
      return borrow.statut !== 'rendu' && 
             new Date(borrow.date_echeance) < today;
    });

    const lateBooks = lateBorrows.map(borrow => ({
      book: books.find(b => b.id === borrow.livre_id),
      daysLate: Math.floor((today - new Date(borrow.date_echeance)) / (1000 * 60 * 60 * 24))
    }));

    res.json(lateBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopCategory = async (req, res) => {
  try {
    const [borrows] = await Borrow.findAll();
    const [books] = await Book.findAll();
    const [categories] = await Category.findAll();

    const categoryCounts = {};
    borrows.forEach(borrow => {
      const book = books.find(b => b.id === borrow.livre_id);
      if (book) {
        categoryCounts[book.categorie_id] = (categoryCounts[book.categorie_id] || 0) + 1;
      }
    });

    const topCategory = Object.entries(categoryCounts)
      .map(([categoryId, count]) => ({
        category: categories.find(c => c.id === parseInt(categoryId)),
        count
      }))
      .sort((a, b) => b.count - a.count)[0];

    res.json(topCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTotals = async (req, res) => {
  try {
    const [borrows] = await Borrow.findAll();
    const [users] = await User.findAll();

    const activeUsers = users.filter(user => {
      return borrows.some(borrow => borrow.utilisateur_id === user.id);
    });

    res.json({
      totalBorrows: borrows.length,
      activeUsers: activeUsers.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};