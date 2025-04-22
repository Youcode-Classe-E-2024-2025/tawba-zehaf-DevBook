const Borrow = require("../models/Borrow");

module.exports = {
  async index(req, res) {
    const [rows] = await Borrow.findAll();
    res.json(rows);
  },

  async show(req, res) {
    const [rows] = await Borrow.findById(req.params.id);
    res.json(rows[0]);
  },

  async store(req, res) {
    await Borrow.create(req.body);
    res.status(201).json({ message: "Emprunt ajouté avec succès" });
  },

  async update(req, res) {
    await Borrow.update(req.params.id, req.body);
    res.json({ message: "Emprunt mis à jour" });
  },

  async destroy(req, res) {
    await Borrow.delete(req.params.id);
    res.json({ message: "Emprunt supprimé" });
  }
};
