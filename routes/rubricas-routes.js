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
  try {
    let rubricas = await Rubrica.getRubricaByEmail(teacher.email);
    res.send(rubricas);
  } catch (e) {
    res.status(400).send("An error has occurred");
  }
  //res.status(200).send({Repuesta: "this is actually working"});
});

router.get("/:id", teacherPermissions, async (req, res) => {
  let rubrica = await Rubrica.getRubricaById(req.params.id);
  res.send(rubrica);
});

router.post("/", teacherPermissions, async (req, res) => {
  let { nombre, preguntas, curso } = req.body;
  let errors = [];
  if (!nombre) errors.push("Nombre");
  if (!preguntas) errors.push("Preguntas");
  if (!curso) errors.push("Curso");
  if (errors.length > 0) {
    res
      .status(400)
      .send(
        "Bad request: " + errors.map((error) => `Missing ${error}`).join(". ")
      );
    return;
  }
  let teacher = jwt.decode(req.get("x-auth"));
  let newdoc = await Rubrica.addRubrica({
    uid: nanoid.nanoid(),
    nombre,
    preguntas,
    owner: teacher.email,
    curso,
  });
  res.status(201).send({ Repuesta: "se ha posteado esta rubrica" });
});

router.delete("/:id", teacherPermissions, async (req, res) => {
  let deletedDoc = await Rubrica.borrarRubrica(req.params.id);
  res.send(deletedDoc);
});

router.put("/:id", teacherPermissions, async (req, res) => {
  let { nombre, preguntas, owner, curso } = req.body;
  let updatedDoc = await Rubrica.actualizarRubrica(req.params.id, req.body);
  res.send(updatedDoc);
});

module.exports = router;
