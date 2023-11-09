const express = require("express");
const router = express.Router();
const userContoller = require("../controllers/users");

router.get(["/","/login"],(req, res) => {
    res.render("login");
});

router.get("/register",(req, res) => {
    res.render("register");
});


router.get("/profile", userContoller.isLoggedIn, (req, res) => {
    if (req.user) {
      res.render("profile", { user: req.user });
    } else {
      res.redirect("/");
    }
  });


router.get("/home", userContoller.isLoggedIn, (req, res) => {
    // console.log(req.name);
    if (req.user) {
      res.render("home", { user: req.user });
    } else {
      res.redirect("/");
    }
  });
module.exports = router;



// const checkAuth = (req, res, next) => {
//   if (req.user) {
//       next(); // User is logged in, proceed to the next middleware or route handler
//   } else {
//       res.redirect("/login"); // User is not logged in, redirect to the login route
//   }
// };

// // Default landing page logic
// router.get("/", (req, res, next) => {
//   if (req.user) {
//       // If the user is logged in, redirect to the home page
//       res.redirect("/home");
//   } else {
//       // If the user is not logged in, redirect to the login page
//       res.redirect("/login");
//   }
// });

// // Login and home routes
// router.get("/login", (req, res) => {
//   res.render("login");
// });

// router.get("/home", checkAuth, (req, res) => {
//   res.render("home", { user: req.user });
// });

// module.exports = router;
