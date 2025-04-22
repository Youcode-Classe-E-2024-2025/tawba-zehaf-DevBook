const User = require("../models/User");

module.exports = {
  async index(req, res) {
    const [rows] = await User.findAll();
    res.json(rows);
  },

  async show(req, res) {
    const [rows] = await User.findById(req.params.id);
    res.json(rows[0]);
  },

  async store(req, res) {
    await User.create(req.body);
    res.status(201).json({ message: "Utilisateur ajouté avec succès" });
  },

  async update(req, res) {
    await User.update(req.params.id, req.body);
    res.json({ message: "Utilisateur mis à jour" });
  },

  async destroy(req, res) {
    await User.delete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
  }
};
