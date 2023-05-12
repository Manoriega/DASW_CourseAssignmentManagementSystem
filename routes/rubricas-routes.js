const router = require("express").Router();
const { Rubrica } = require("../database/rubrics");
const nanoid = require("nanoid");
const {Assignments} = require("../database/Assignments");
const {Entregas} = require("../database/Entregas");
const { validateRubricPost } = require("../middlewares/validation");
const jwt = require("jsonwebtoken");
const {
  isLogged,
  onlyAdmin,
  teacherPermissions,
  isStudentOrTeacher,
  handleExceptions,
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
    handleExceptions(e, res);
  }
  //res.status(200).send({Repuesta: "this is actually working"});
});

router.get("/:id", teacherPermissions, async (req, res) => {
  try {
    let rubrica = await Rubrica.getRubricaById(req.params.id);
    res.send(rubrica);
  } catch (e) {
    handleExceptions(e, res);
  }
});

router.post("/", teacherPermissions, async (req, res) => {
  try {
    let teacherToken = req.get("x-auth"),
      teacher = jwt.decode(teacherToken);
    let { nombre, preguntas, curso } = req.body;
    let errors = [];
    if (!nombre) errors.push("Nombre");
    if (!preguntas) errors.push("Preguntas");
    if (!teacher) errors.push("Owner");
    if (!curso) errors.push("Curso");
    if (errors.length > 0) {
      handleError(
        res,
        "Bad request: " + errors.map((error) => `Falta ${error}`).join(". ")
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
  } catch (e) {
    handleExceptions(e, res);
  }
});

router.delete("/:id", teacherPermissions, async (req, res) => {
  let valid;
  let rubrica = req.params.id;
  let rubricaID = await Rubrica.getRubricaPrivateId(req.params.id);
  let rubricaToFind = {rubricId: rubricaID};
  let assignmentToFind = await Assignments.getAssignments(rubricaToFind);
  console.log(assignmentToFind);
    for(let i = 0; i < assignmentToFind.length; i++) {
      let filter = {assignmentId : assignmentToFind[i]._id}
      console.log(assignmentToFind[i]);
      let alreadyentregado = await Entregas.getEntregas(filter)
      if(alreadyentregado.length > 0) 
        {
          console.log(alreadyentregado);
          res.status(400).send({Error: "No puedes borrar esta rubrica"});
          return;
        }
    }

      let deletedDoc = await Rubrica.borrarRubrica(req.params.id);
      res.send(deletedDoc);
    
  }
);

router.put("/:id", teacherPermissions, async (req, res) => {
  try {
    let teacherToken = req.get("x-auth"),
      teacher = jwt.decode(teacherToken);
    let updatedRubrica = {};
    let { nombre, preguntas, curso } = req.body;
    if (nombre) updatedRubrica.nombre = nombre;
    if (preguntas) updatedRubrica.preguntas = preguntas;
    if (curso) updatedRubrica.curso = curso;
    updatedRubrica.fecha = Date.now();
    updatedRubrica.owner = teacher.email;

    let rubricaID = await Rubrica.getRubricaPrivateId(req.params.id);
  let rubricaToFind = {rubricId: rubricaID};
  let assignmentToFind = await Assignments.getAssignments(rubricaToFind);
  console.log(assignmentToFind);
    for(let i = 0; i < assignmentToFind.length; i++) {
      let filter = {assignmentId : assignmentToFind[i]._id}
      console.log(assignmentToFind[i]);
      let alreadyentregado = await Entregas.getEntregas(filter)
      if(alreadyentregado.length > 0) 
        {
          console.log(alreadyentregado);
          res.status(400).send({Error: "No puedes borrar esta rubrica"});
          return;
        }
    }
    let updatedDoc = await Rubrica.actualizarRubrica(
      req.params.id,
      updatedRubrica
    );
    res.send(updatedDoc);
  } catch (e) {
    handleExceptions(e, res);
  }
});

module.exports = router;
