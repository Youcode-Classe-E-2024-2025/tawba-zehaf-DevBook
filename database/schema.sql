CREATE DATABASE devbook;

USE devbook;
CREATE TABLE categorie (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL
);
CREATE TABLE livre (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  auteur VARCHAR(255) NOT NULL,
  categorieId INT,
  status VARCHAR(50),
  FOREIGN KEY (categorieId) REFERENCES categorie(id)
);
CREATE TABLE utilisateur (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);
CREATE TABLE emprunt (
  livreId INT,
  utilisateurId INT,
  dateEmprunt DATE,
  dateRetour DATE,
  PRIMARY KEY (livreId, utilisateurId),
  FOREIGN KEY (livreId) REFERENCES livre(id),
  FOREIGN KEY (utilisateurId) REFERENCES utilisateur(id)
);

INSERT INTO categorie (nom) VALUES ('Programmation'), ('Design'), ('Architecture');

INSERT INTO livre (titre, auteur, categorieId, status) 
VALUES ('JavaScript pour les nuls', 'John Doe', 1, 'à lire'),
       ('Apprendre le design', 'Jane Doe', 2, 'en cours');


INSERT INTO utilisateur (nom, email) 
VALUES ('Alice', 'alice@example.com'),
       ('Bob', 'bob@example.com');

INSERT INTO emprunt (livreId, utilisateurId, dateEmprunt, dateRetour) 
VALUES (1, 1, '2025-04-01', '2025-04-15'),
       (2, 2, '2025-04-05', '2025-04-20');
