const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrow.controller");

// Routes RESTful pour /emprunts
router.get("/", borrowController.index);        // GET /emprunts
router.get("/:id", borrowController.show);      // GET /emprunts/:id
router.post("/", borrowController.store);       // POST /emprunts
router.put("/:id", borrowController.update);    // PUT /emprunts/:id
router.delete("/:id", borrowController.destroy); // DELETE /emprunts/:id

module.exports = router;
