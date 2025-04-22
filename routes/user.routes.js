const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Routes RESTful pour /users
router.get("/", userController.index);       // GET /users
router.get("/:id", userController.show);     // GET /users/:id
router.post("/", userController.store);      // POST /users
router.put("/:id", userController.update);   // PUT /users/:id
router.delete("/:id", userController.destroy); // DELETE /users/:id

module.exports = router;
