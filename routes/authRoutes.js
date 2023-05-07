const { Users } = require("../database/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = require("express").Router();

// Loggear con token

router.get("/", async (req, res) => {
  let token = req.get("x-auth");
  if (!token) {
    res.status(404).send("Missing authentication");
    return;
  }
  try {
    jwt.verify(token, "daswCosym", function (err, decoded) {
      if (err) {
        res.status(402).send("Token provided is not valid");
        return;
      }
      res.send(decoded);
    });
  } catch (e) {
    res.status(400).send("An error has occurred");
  }
});

// Login

router.post("/", async (req, res) => {
  let { email, password } = req.body;
  let errors = [];

  if (!email) errors.push("Email");
  if (!password) errors.push("Password");

  if (errors.length > 0) {
    res
      .status(400)
      .send(
        "Bad request: " + errors.map((error) => `Missing ${error}`).join(". ")
      );
    return;
  }
  try {
    let userEmail = await Users.getUserByEmail(email);
    if (userEmail) {
      let userPassword = userEmail.password;
      bcrypt.compare(password, userPassword, (err, okay) => {
        if (okay) {
          let token = jwt.sign(
            {
              email: email,
              uid: userEmail.uid,
              usertype: userEmail.usertype,
            },
            "daswCosym"
          );
          res.send({ token, usertype: userEmail.usertype });
        } else {
          res.status(404).send("Bad password");
        }
      });
    } else res.status(404).send("Email not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
  }
});

module.exports = router;
