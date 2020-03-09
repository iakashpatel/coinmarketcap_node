require("../db/db");
var express = require("express");
var router = express.Router();
var passport = require("../passport/index");
const Users = require("../models/users");

/* GET users listing. */
router.get("/", async function(req, res, next) {
  try {
    const users = await Users.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

router.post("/login", passport.authenticate("local"), function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.send({
    user: req.user
  });
});

router.post("/register", async function(req, res) {
  try {
    const {
      email = "",
      password = "",
      first_name = "",
      last_name = ""
    } = req.body;
    if (!email || !password) {
      throw Error("invalid");
    } else {
      const user = new Users({
        email,
        password,
        first_name,
        last_name
      });
      return user
        .save()
        .then(() => {
          return res.send({ user });
        })
        .catch(error => res.status(400).send({ error }));
    }
  } catch (error) {
    return res.status(400).send({ error: "failed/invalid" });
  }
});

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/fail"
  })
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login", "email"]
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/fail"
  })
);

router.get("/fail", (req, res) => {
  res.send("Failed attempt");
});

router.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.redirect("/");
});

module.exports = router;
