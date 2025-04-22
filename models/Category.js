const db = require('../core/Database');

class Category {
  static findAll() {
    return db.query("SELECT * FROM categories");
  }

  static findById(id) {
    return db.query("SELECT * FROM categories WHERE id = ?", [id]);
  }

  static create(data) {
    return db.query("INSERT INTO categories (nom, description) VALUES (?, ?)", [
      data.nom,
      data.description
    ]);
  }

  static update(id, data) {
    return db.query("UPDATE categories SET nom = ?, description = ? WHERE id = ?", [
      data.nom,
      data.description,
      id
    ]);
  }

  static delete(id) {
    return db.query("DELETE FROM categories WHERE id = ?", [id]);
  }
}

module.exports = Category;
