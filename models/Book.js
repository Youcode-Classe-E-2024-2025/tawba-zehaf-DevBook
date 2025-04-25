const db = require('../core/Database');

class Book {
  static findAll() {
    return db.query("SELECT * FROM livres");
  }

  static findById(id) {
    return db.query("SELECT * FROM livres WHERE id = ?", [id]);
  }

  static create(data) {
    return db.query("INSERT INTO livres (titre, auteur, statut, categorie_id) VALUES (?, ?, ?, ?)", [
      data.titre,
      data.auteur,
      data.statut,
      data.categorie_id
    ]);
  }

  static update(id, data) {
    return db.query("UPDATE livres SET titre = ?, auteur = ?, statut = ?, categorie_id = ? WHERE id = ?", [
      data.titre,
      data.auteur,
      data.statut,
      data.categorie_id,
      id
    ]);
  }

  static delete(id) {
    return db.query("DELETE FROM livres WHERE id = ?", [id]);
  }
  
  static async search(query, page = 1, limit = 10, sort = 'titre', order = 'ASC') {
    const offset = (page - 1) * limit;
    const searchQuery = `%${query}%`;
    
    const [rows] = await db.query(
      `SELECT * FROM livres 
       WHERE titre LIKE ? OR auteur LIKE ? 
       ORDER BY ${sort} ${order} 
       LIMIT ? OFFSET ?`,
      [searchQuery, searchQuery, limit, offset]
    );
    
    const [total] = await db.query(
      `SELECT COUNT(*) as total FROM livres 
       WHERE titre LIKE ? OR auteur LIKE ?`,
      [searchQuery, searchQuery]
    );
    
    return {
      books: rows,
      total: total[0].total,
      page,
      limit
    };
  }

  static async getCategories() {
    return db.query("SELECT * FROM categories ORDER BY nom");
  }


}

module.exports = Book;