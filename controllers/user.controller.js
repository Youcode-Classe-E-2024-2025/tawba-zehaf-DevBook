const User = require('../models/User');
const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

module.exports = {
  async index(req, res) {
    try {
      // Récupérer tous les utilisateurs avec le nombre d'emprunts
      const [users] = await User.findAll();
      
      // Ajouter le nombre d'emprunts pour chaque utilisateur
      const usersWithBorrows = await Promise.all(users.map(async user => {
        const [borrows] = await Borrow.findAll();
        const userBorrows = borrows.filter(borrow => borrow.utilisateur_id === user.id);
        return {
          ...user,
          emprunts_count: userBorrows.length
        };
      }));

      res.json(usersWithBorrows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async show(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user[0]) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      // Récupérer les emprunts de l'utilisateur
      const [borrows] = await Borrow.findAll();
      const userBorrows = borrows.filter(borrow => borrow.utilisateur_id === req.params.id);

      // Ajouter les informations du livre pour chaque emprunt
      const borrowsWithBooks = await Promise.all(userBorrows.map(async borrow => {
        const [books] = await Book.findAll();
        const book = books.find(b => b.id === borrow.livre_id);
        return {
          ...borrow,
          livre: book
        };
      }));

      res.json({
        ...user[0],
        emprunts: borrowsWithBooks
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async store(req, res) {
    try {
      const { nom, email } = req.body;
      if (!nom || !email) {
        return res.status(400).json({ error: 'Le nom et l\'email sont requis' });
      }

      const user = await User.create({
        nom,
        email
      });

      res.status(201).json(user[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user[0]) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const updatedUser = await User.update(req.params.id, req.body);
      res.json(updatedUser[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async destroy(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user[0]) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      // Vérifier s'il y a des emprunts en cours
      const [borrows] = await Borrow.findAll();
      const userBorrows = borrows.filter(borrow => borrow.utilisateur_id === req.params.id);
      const activeBorrows = userBorrows.filter(borrow => borrow.statut !== 'rendu');

      if (activeBorrows.length > 0) {
        return res.status(400).json({ 
          error: 'Impossible de supprimer l\'utilisateur car il a des emprunts en cours' 
        });
      }

      await User.delete(req.params.id);
      res.json({ message: 'Utilisateur supprimé' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
