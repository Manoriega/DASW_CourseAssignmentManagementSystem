const jwt = require("jsonwebtoken");
const { Users } = require("../database/Users");

// Manejar excepciones
function handleExceptions(e, res) {
  handleExceptions(e, res);
  res.status(500).send("Internal server error");
  return;
}

// Manejar errores
function handleError(res, msg) {
  res.status(400).json({ errors: msg });
}

// Redireccionar si no está loggeado
async function redirect(req, res, next) {
  if (req.originalUrl == "/") {
    next();
    return;
  }
  res.redirect("/");
}

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
        user = await Users.getUserByUid(userD.uid),
        groupId = req.params.groupId || null;
      if (user) {
        if (groupId) {
          if (user.groups.includes(groupId) || userD.usertype == 3) next();
          else res.status(401).send({ belongs: false });
        } else handleError(res, "Falta id de grupo");
      } else res.status(404).send("User not found");
    });
  } catch (e) {
    handleExceptions(e, res);
    res.status(500).send("Internal server error");
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
    handleExceptions(e, res);
    res.status(500).send("Internal server error");
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
    handleExceptions(e, res);
    res.status(500).send("Internal server error");
  }
}

// Solo administrador loggeado
async function onlyAdminLogged(req, res, next) {
  let xAuth = req.get("x-auth") || req.cookies.userToken || null;

  if (!xAuth) {
    res.redirect("/");
    return;
  }
  try {
    jwt.verify(xAuth, "daswCosym", function (err, decoded) {
      if (err) {
        res.redirect("/");
        return;
      }
      if (decoded.usertype != 3) res.redirect("/");
      else next();
    });
  } catch (e) {
    res.redirect("/");
  }
}

// Solo permisos de administrador
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
    handleExceptions(e, res);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  isLogged,
  onlyAdmin,
  teacherPermissions,
  isStudentOrTeacher,
  redirect,
  onlyAdminLogged,
  handleError,
  handleExceptions,
};
