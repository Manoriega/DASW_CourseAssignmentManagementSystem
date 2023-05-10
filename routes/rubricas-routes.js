const router = require("express").Router();
const { Rubrica } = require("../database/rubrics");
const nanoid = require("nanoid");
const { validateRubricPost } = require("../middlewares/validation");
const jwt = require("jsonwebtoken");
const {
  isLogged,
  onlyAdmin,
  teacherPermissions,
  isStudentOrTeacher,
} = require("../middlewares");

router.get("/", isLogged, async (req, res) => {
  let teacherToken = req.get("x-auth"),
    teacher = jwt.decode(teacherToken);
  let { fecha, curso, nombre } = req.query;
  let filters = { owner: teacher.email };
  if (fecha) filters.fecha = new RegExp(fecha, "i");
  if (curso) filters.curso = new RegExp(curso, "i");
  if (nombre) filters.nombre = new RegExp(nombre, "i");
  try {
    let rubricas = await Rubrica.getTeacherRubricas(filters);
    res.send(rubricas);
  } catch (e) {
    console.log(e);
    res.status(400).send("An error has occurred");
  }
  //res.status(200).send({Repuesta: "this is actually working"});
});

router.get("/:id", teacherPermissions, async (req, res) => {
  let rubrica = await Rubrica.getRubricaById(req.params.id);
  res.send(rubrica);
});

router.post("/", teacherPermissions, async (req, res) => {
  let teacherToken = req.get("x-auth"),
    teacher = jwt.decode(teacherToken);
  let { nombre, preguntas, curso } = req.body;
  let errors = [];
  if (!nombre) errors.push("Nombre");
  if (!preguntas) errors.push("Preguntas");
  if (!teacher) errors.push("Owner");
  if (!curso) errors.push("Curso");
  if (errors.length > 0) {
    res
      .status(400)
      .send(
        "Bad request: " + errors.map((error) => `Missing ${error}`).join(". ")
      );
    return;
  }
  let newdoc = await Rubrica.addRubrica({
    uid: nanoid.nanoid(),
    nombre,
    preguntas,
    owner: teacher.email,
    curso,
  });
  res.status(201).send(newdoc);
});

router.delete("/:id", teacherPermissions, async (req, res) => {
  let deletedDoc = await Rubrica.borrarRubrica(req.params.id);
  res.send(deletedDoc);
});

router.put("/:id", teacherPermissions, async (req, res) => {
  let teacherToken = req.get("x-auth"),
    teacher = jwt.decode(teacherToken);
  let updatedRubrica = {};
  let { nombre, preguntas, curso } = req.body;
  if (nombre) updatedRubrica.nombre = nombre;
  if (preguntas) updatedRubrica.preguntas = preguntas;
  if (curso) updatedRubrica.curso = curso;
  updatedRubrica.fecha = Date.now();
  updatedRubrica.owner = teacher.email;
  let updatedDoc = await Rubrica.actualizarRubrica(
    req.params.id,
    updatedRubrica
  );
  res.send(updatedDoc);
});

module.exports = router;
