const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");

// Routes RESTful pour /books
router.get("/", bookController.index);       // GET /books
router.get("/:id", bookController.show);     // GET /books/:id
router.post("/", bookController.store);      // POST /books
router.put("/:id", bookController.update);   // PUT /books/:id
router.delete("/:id", bookController.destroy); // DELETE /books/:id

module.exports = router;
