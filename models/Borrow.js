const db = require('../core/Database');

class Borrow {
  static findAll() {
    return db.query("SELECT * FROM emprunts");
  }

  static findById(id) {
    return db.query("SELECT * FROM emprunts WHERE id = ?", [id]);
  }

  static create(data) {
    return db.query("INSERT INTO emprunts (utilisateur_id, livre_id, date_emprunt, date_echeance) VALUES (?, ?, ?, ?)", [
      data.utilisateur_id,
      data.livre_id,
      data.date_emprunt,
      data.date_echeance
    ]);
  }

  static update(id, data) {
    return db.query("UPDATE emprunts SET utilisateur_id = ?, livre_id = ?, date_emprunt = ?, date_echeance = ? WHERE id = ?", [
      data.utilisateur_id,
      data.livre_id,
      data.date_emprunt,
      data.date_echeance,
      id
    ]);
  }

  static delete(id) {
    return db.query("DELETE FROM emprunts WHERE id = ?", [id]);
  }
}

module.exports = Borrow;
