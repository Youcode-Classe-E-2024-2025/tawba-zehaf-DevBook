const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");

// Routes pour les statistiques
router.get("/top-books", statsController.getTopBooks); // Top 10 livres les plus empruntés
router.get("/late-books", statsController.getLateBooks); // Livres en retard
router.get("/top-category", statsController.getTopCategory); // Catégorie la plus empruntée
router.get("/totals", statsController.getTotals); // Totaux généraux

module.exports = router;