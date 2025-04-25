const Category = require('../models/Category');
const Book = require('../models/Book');

module.exports = {
  async index(req, res) {
    try {
      // Récupérer les catégories avec le nombre de livres
      const [categories] = await Category.findAll();
      
      // Ajouter le nombre de livres pour chaque catégorie
      const categoriesWithCount = await Promise.all(categories.map(async category => {
        const [books] = await Book.findAll();
        const booksInCategory = books.filter(book => book.categorie_id === category.id);
        return {
          ...category,
          livres_count: booksInCategory.length
        };
      }));

      res.json(categoriesWithCount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async show(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category[0]) {
        return res.status(404).json({ error: 'Catégorie non trouvée' });
      }

      // Récupérer les livres de cette catégorie
      const [books] = await Book.findAll();
      const booksInCategory = books.filter(book => book.categorie_id === category[0].id);

      res.json({
        ...category[0],
        livres: booksInCategory
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async store(req, res) {
    try {
      const { nom } = req.body;
      if (!nom) {
        return res.status(400).json({ error: 'Le nom est requis' });
      }

      const category = await Category.create({
        nom,
        description: '' // Optionnel
      });

      res.status(201).json(category[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category[0]) {
        return res.status(404).json({ error: 'Catégorie non trouvée' });
      }

      const updatedCategory = await Category.update(req.params.id, req.body);
      res.json(updatedCategory[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async destroy(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category[0]) {
        return res.status(404).json({ error: 'Catégorie non trouvée' });
      }

      // Vérifier s'il y a des livres dans cette catégorie
      const [books] = await Book.findAll();
      const booksInCategory = books.filter(book => book.categorie_id === category[0].id);

      if (booksInCategory.length > 0) {
        return res.status(400).json({ 
          error: 'Impossible de supprimer la catégorie car elle contient des livres' 
        });
      }

      await Category.delete(req.params.id);
      res.json({ message: 'Catégorie supprimée' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
