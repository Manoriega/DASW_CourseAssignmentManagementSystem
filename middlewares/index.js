const jwt = require("jsonwebtoken");
const { Users } = require("../database/Users");

// Solo estudiantes o maestro del grupo
async function isStudentOrTeacher(req, res, next) {
  let xAuth = req.get("x-auth") || {};
  if (!xAuth) {
    res.status(403).send("Missing authentication");
    return;
  }
  try {
    jwt.verify(xAuth, "daswCosym", async function (err, decoded) {
      if (err) {
        res.status(403).send("Missing authentication");
        return;
      }
      let userD = decoded,
        user = await Users.getUserById(userD.uid),
        groupId = req.params.id || null;
      if (user) {
        if (groupId) {
          if (user.groups.includes(groupId)) next();
          else res.status(401).send({ belongs: false });
        } else res.status(400).send("Missing group id");
      } else res.status(404).send("User not found");
    });
  } catch (e) {
    res.status(400).send("An error has occurred");
  }
}

// Solo usuarios loggeados
async function isLogged(req, res, next) {
  let xAuth = req.get("x-auth") || {};
  if (!xAuth) {
    res.redirect("/");
    return;
  }
  try {
    jwt.verify(xAuth, "daswCosym", function (err, decoded) {
      if (err) {
        res.status(403).send("Missing authentication");
        return;
      }
      next();
    });
  } catch (e) {
    res.status(400).send("An error has occurred");
  }
}

// Solo permisos de profesor o administrador
async function teacherPermissions(req, res, next) {
  let xAuth = req.get("x-auth") || null;

  if (!xAuth) {
    res.status(403).send("Missing authentication");
    return;
  }
  try {
    jwt.verify(xAuth, "daswCosym", function (err, decoded) {
      if (err) {
        res.status(403).send("Missing authentication");
        return;
      }
      if (decoded.usertype == 2 || decoded.usertype == 3) next();
      else res.status(401).send("You don't have the permissions");
    });
  } catch (e) {
    res.status(400).send("An error has occurred");
  }
}

// Solo administrador
async function onlyAdmin(req, res, next) {
  let xAuth = req.get("x-auth") || req.cookies.userToken || null;

  if (!xAuth) {
    res.status(403).send("Missing authentication");
    return;
  }
  try {
    jwt.verify(xAuth, "daswCosym", function (err, decoded) {
      if (err) {
        res.status(403).send("Missing authentication");
        return;
      }
      if (decoded.usertype != 3)
        res.status(401).send("You don't have the permissions");
      else next();
    });
  } catch (e) {
    res.status(400).send("An error has occurred");
  }
}

module.exports = {
  isLogged,
  onlyAdmin,
  teacherPermissions,
  isStudentOrTeacher,
};
