const router = require("express").Router();
const bcrypt = require("bcryptjs");
const nanoid = require("nanoid");
const jwt = require("jsonwebtoken");
const { Users } = require("../database/Users");
const { Groups } = require("../database/Groups");
const {
  onlyAdmin,
  isLogged,
  handleExceptions,
  handleError,
} = require("../middlewares");

// Obtener mi usuario
router.get("/myuser", isLogged, async (req, res) => {
  let studentToken = req.get("x-auth"),
    student = jwt.decode(studentToken);
  try {
    let user = await Users.getUserByUid(student.uid);
    if (user) res.send(user);
    else res.status(404).send("User not found");
  } catch (e) {
    handleExceptions(e, res);
  }
});

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
    handleExceptions(e, res);
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
    handleError(
      res,
      "Bad request: " + errors.map((error) => `Falta ${error}`).join(". ")
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
    handleExceptions(e, res);
  }
});

// Ver un usuario

router.get("/:id", onlyAdmin, async (req, res) => {
  try {
    let user = await Users.getUserByUid(req.params.id);
    if (user) res.send(user);
    else res.status(404).send("User not found");
  } catch (e) {
    handleExceptions(e, res);
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
        handleError(res, "Bad request. Nada que actualizar");
      else {
        let mongoResponse = await Users.updateUser(req.params.id, userUpdated);
        res.send("User updated");
      }
    } else res.status(404).send("User not found");
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Eliminar un estudiante

router.delete("/:id", onlyAdmin, async (req, res) => {
  try {
    let user = await Users.getUserByUid(req.params.id);
    if (user) {
      if (user.usertype == 1) {
        await Users.deleteUser(req.params.id);
        await Groups.deleteStudent(req.params.id);
      } else {
        if (user.groups.length >= 1) {
          handleError(res, "El profesor tiene grupos activos");
          return;
        } else {
          await Users.deleteUser(req.params.id);
        }
      }
      res.send("User deleted");
    } else res.status(404).send("User not found");
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Cambiar contraseña
router.post("/password", isLogged, async (req, res) => {
  try {
    let { oldPassword, newPassword } = req.body,
      studentToken = req.get("x-auth"),
      student = jwt.decode(studentToken),
      user = await Users.getUserByEmail(student.email);
    bcrypt.compare(oldPassword, user.password, async (err, okay) => {
      if (okay) {
        let password = bcrypt.hashSync(newPassword, 8);
        let mongoResponse = await Users.updateUser(student.uid, { password });
        res.send(mongoResponse);
      } else {
        res.status(404).json({ status: 1 });
      }
    });
  } catch (e) {
    handleExceptions(e, res);
  }
});

module.exports = router;
