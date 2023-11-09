const express = require("express");
const userController = require("../controllers/users");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
// router.get("/home", userController.home);

module.exports = router;