CREATE TABLE IF NOT EXISTS utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('admin', 'utilisateur') DEFAULT 'utilisateur',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
