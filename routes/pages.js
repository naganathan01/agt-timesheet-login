const express = require("express");
const router = express.Router();
const userContoller = require("../controllers/users");
router.get("/",(req, res) => {
    res.render("login");
});

router.get("/register",(req, res) => {
    res.render("register");
});

router.get("/home",(req, res) => {
    res.render("home");
});

router.get("/profile",(req, res) => {
    res.render("profile");
});

router.get("/login",(req, res) => {
    res.render("login");
});

module.exports = router;