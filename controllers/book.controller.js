const Book = require("../models/Book");

module.exports = {
  async index(req, res) {
    const [rows] = await Book.findAll();
    res.json(rows);
  },

  async show(req, res) {
    const [rows] = await Book.findById(req.params.id);
    res.json(rows[0]);
  },

  async store(req, res) {
    await Book.create(req.body);
    res.status(201).json({ message: "Livre ajouté avec succès" });
  },

  async update(req, res) {
    await Book.update(req.params.id, req.body);
    res.json({ message: "Livre mis à jour" });
  },

  async destroy(req, res) {
    await Book.delete(req.params.id);
    res.json({ message: "Livre supprimé" });
  }
};
