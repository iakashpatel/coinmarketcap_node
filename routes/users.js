require("../db/db");
var express = require("express");
var router = express.Router();
var passport = require("../passport/index");
const Users = require("../models/users");
var { authCheck } = require("../middlewares/auth");

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

// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated

router.get("/profile", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  });
});

router.get("/profile/callback", authCheck, (req, res) => {
  res.redirect(process.env.CLIENT_CALLBACK_URL);
});

router.post("/login", passport.authenticate("local"), function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.send({
    user: req.user
  });
});

router.patch("/update/:id", authCheck, async function(req, res) {
  try {
    const {
      email = "",
      password = "",
      first_name = "",
      last_name = ""
    } = req.body;

    const id = req.params.id;

    if (!first_name || !last_name || !email || !id) {
      throw Error("invalid");
    } else {
      let user = await Users.findById(id);
      if (!user) {
        throw Error("no user found");
      }
      user.first_name = first_name;
      user.last_name = last_name;
      if (password) {
        user.password = password;
      }
      user.email = email;
      return user
        .save()
        .then(() => {
          req.session.passport.user.first_name = first_name;
          req.session.passport.user.last_name = last_name;
          req.session.passport.user.email = email;
          return res.send({ user });
        })
        .catch(error => res.status(400).send({ error }));
    }
  } catch (error) {
    return res.status(400).send({ error: "failed/invalid" });
  }
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
    successRedirect: "/users/profile/callback",
    failureRedirect: "/"
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
    successRedirect: "/users/profile/callback",
    failureRedirect: "/"
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.send({ success: true });
});

module.exports = router;
