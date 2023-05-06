const router = require("express").Router();
const bcrypt = require("bcryptjs");
const nanoid = require("nanoid");
const { Users } = require("../database/Users");
const { Groups } = require("../database/Groups");
const { onlyAdmin } = require("../middlewares");

// Ver todos los usuarios

router.get("/", onlyAdmin, async (req, res) => {
  let { uid, name, lastname, email, usertype, group } = req.query;
  let filters = {};

  if (uid) filters.uid = new RegExp(uid, "i");
  if (name) filters.name = new RegExp(name, "i");
  if (lastname) filters.lastname = new RegExp(lastname, "i");
  if (email) filters.email = new RegExp(email, "i");
  if (usertype) filters.usertype = usertype;
  if (group) filters.groups = { $in: [group] };

  try {
    let users = await Users.getUsers(filters);
    res.send(users);
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Crear un usuario

router.post("/", onlyAdmin, async (req, res) => {
  let { name, lastname, email, password, usertype } = req.body;
  let errors = [];
  if (!name) errors.push("Name");
  if (!lastname) errors.push("Last name");
  if (!email) errors.push("Email");
  if (!password) errors.push("Password");
  if (!usertype) errors.push("User type");
  if (errors.length > 0) {
    res
      .status(400)
      .send(
        "Bad request: " + errors.map((error) => `Missing ${error}`).join(". ")
      );
    return;
  }
  let encryptedPassword = bcrypt.hashSync(password, 8);
  let newUser = {
    uid: nanoid.nanoid(),
    name,
    lastname,
    email,
    password: encryptedPassword,
    usertype,
  };

  try {
    let mongoResponse = await Users.createUser(newUser);
    res.status(201).send(mongoResponse);
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Ver un usuario

router.get("/:id", onlyAdmin, async (req, res) => {
  try {
    let user = await Users.getUserByUid(req.params.id);
    if (user) res.send(user);
    else res.status(404).send("User not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Actualizar un estudiante

router.put("/:id", onlyAdmin, async (req, res) => {
  try {
    let user = await Users.getUserByUid(req.params.id);
    if (user) {
      let { name, lastname, email, password } = req.body;
      let userUpdated = {};
      if (name) userUpdated.name = name;
      if (lastname) userUpdated.lastname = lastname;
      if (email) userUpdated.email = email;
      if (password) userUpdated.password = password;
      if (!name && !lastname && !email && !password)
        res.status(400).send("Bad request. Nothing to update");
      else {
        let mongoResponse = await Users.updateUser(req.params.id, userUpdated);
        res.send("User updated");
      }
    } else res.status(404).send("User not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Eliminar un estudiante

router.delete("/:id", onlyAdmin, async (req, res) => {
  try {
    let user = await Users.getUserByUid(req.params.id);
    if (user) {
      await Users.deleteUser(req.params.id);
      await Groups.deleteStudent(req.params.id);
      res.send("User deleted");
    } else res.status(404).send("User not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

module.exports = router;
