const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

// Routes RESTful pour /categories
router.get("/", categoryController.index);       // GET /categories
router.get("/:id", categoryController.show);     // GET /categories/:id
router.post("/", categoryController.store);      // POST /categories
router.put("/:id", categoryController.update);   // PUT /categories/:id
router.delete("/:id", categoryController.destroy); // DELETE /categories/:id

module.exports = router;
