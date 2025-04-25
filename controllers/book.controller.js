const Book = require('../models/Book');

exports.index = async (req, res) => {
  try {
    const { query = '', page = 1, limit = 10, sort = 'titre', order = 'ASC' } = req.query;
    const result = await Book.search(query, parseInt(page), parseInt(limit), sort, order);
    const categories = await Book.getCategories();
    
    res.json({
      books: result.books,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit)
      },
      categories: categories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.store = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.json(book[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const book = await Book.update(req.params.id, req.body);
    res.json(book[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.destroy = async (req, res) => {
  try {
    const book = await Book.delete(req.params.id);
    res.json(book[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
