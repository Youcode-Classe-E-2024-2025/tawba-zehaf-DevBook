const db = require('../core/Database');

class User {
  static findAll() {
    return db.query("SELECT * FROM utilisateurs");
  }

  static findById(id) {
    return db.query("SELECT * FROM utilisateurs WHERE id = ?", [id]);
  }

  static create(data) {
    return db.query("INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)", [
      data.nom,
      data.email,
      data.mot_de_passe,
      data.role
    ]);
  }

  static update(id, data) {
    return db.query("UPDATE utilisateurs SET nom = ?, email = ?, mot_de_passe = ?, role = ? WHERE id = ?", [
      data.nom,
      data.email,
      data.mot_de_passe,
      data.role,
      id
    ]);
  }

  static delete(id) {
    return db.query("DELETE FROM utilisateurs WHERE id = ?", [id]);
  }
}

module.exports = User;
