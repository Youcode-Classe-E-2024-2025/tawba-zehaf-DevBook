const Category = require("../models/Category");

module.exports = {
  async index(req, res) {
    const [rows] = await Category.findAll();
    res.json(rows);
  },

  async show(req, res) {
    const [rows] = await Category.findById(req.params.id);
    res.json(rows[0]);
  },

  async store(req, res) {
    await Category.create(req.body);
    res.status(201).json({ message: "Catégorie ajoutée avec succès" });
  },

  async update(req, res) {
    await Category.update(req.params.id, req.body);
    res.json({ message: "Catégorie mise à jour" });
  },

  async destroy(req, res) {
    await Category.delete(req.params.id);
    res.json({ message: "Catégorie supprimée" });
  }
};
