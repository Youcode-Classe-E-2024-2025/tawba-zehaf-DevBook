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
}

module.exports = Book;