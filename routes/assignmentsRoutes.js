const router = require("express").Router();
let path = require("path");
let formidable = require("formidable");
const jwt = require("jsonwebtoken");
let archiver = require("archiver");
let {
  teacherPermissions,
  isStudentOrTeacher,
  isLogged,
} = require("../middlewares/index");
const { Groups } = require("../database/Groups");
const { Assignments } = require("../database/Assignments");
const { Entregas } = require("../database/Entregas");
let fs = require("fs");

// Crear tarea - Profesor
router.post("/", teacherPermissions, async (req, res) => {
  console.log(req.body);
  let { title, description, dueDate, rubricId } = req.body;
  let errors = [];
  if (!title) errors.push("Title");
  if (!description) errors.push("Description");
  if (!dueDate) errors.push("Due date");
  if (!rubricId) errors.push("Rubric Id");
  if (errors.length > 0) {
    res
      .status(400)
      .send(
        "Bad request: " + errors.map((error) => `Missing ${error}`).join(". ")
      );
    return;
  }
  let newAssignment = { title, description, dueDate, rubricId };

  try {
    let mongoResponse = await Assignments.createAssignment(newAssignment);
    res.status(201).send(mongoResponse);
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Subir tarea - Alumno
router.post("/submit/:id", isLogged, async (req, res) => {
  /* let form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) throw err;
    let { user_id } = fields;
    let errors = [];

    if (!user_id) errors.push("User");

    if (errors.length > 0) {
      res
        .status(400)
        .send(
          "Bad request: " + errors.map((error) => `Missing ${error}`).join(". ")
        );
      return;
    }

    let oldPath = files.pdf.filepath;
    let projectDir = path.join(__dirname, "..");
    let newPath = path.join(projectDir, "uploads", fileName);

    let readStream = fs.createReadStream(oldPath);

    let writeStream = fs.createWriteStream(newPath);

    readStream.pipe(writeStream);

    writeStream.on("finish", () => {
      fs.unlink(oldPath, (err) => {
        if (err) throw err;

        let referer = req.headers.referer;
        res.redirect(referer);
      });
    });
  }); */
  let { studentDeliver, reviewer, fileName } = req.body;
  let errors = [];
  if (!studentDeliver) errors.push("Student deliver");
  if (!reviewer) errors.push("Reviewer");
  if (!fileName) errors.push("File name");
  if (errors.length > 0) {
    res
      .status(400)
      .send(
        "Bad request: " + errors.map((error) => `Missing ${error}`).join(". ")
      );
    return;
  }
  let newEntrega = {
    assignmentId: req.params.id,
    studentDeliver,
    reviewer,
    fileName,
  };
  try {
    let mongoResponse = await Entregas.createEntrega(newEntrega);
    res.status(201).send(mongoResponse);
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Descargar todas las entregas - Profesor
router.get("/download/all/:assignmentid", async (req, res) => {});

// Descargar una entrega - Profesor
router.get("/download/:assignmentEntry", async (req, res) => {});

// Ver todas las entregas - Profesor
router.get("/:id/entries", async (req, res) => {});

// Ver una entrega - Profesor/Alumno
router.get("/entry/:id", isLogged, async (req, res) => {
  try {
    let entry = await Entregas.getEntregaById(req.params.id);
    if (entry) res.send(entry);
    else res.status(404).send("Entry not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Editar tarea - Profesor
router.put("/:id", teacherPermissions, async (req, res) => {
  try {
    let assignmentId = req.params.id;
    let assignment = await Assignments.getAssignmentById(assignmentId);
    if (assignment) {
      let { title, description, dueDate } = req.body;
      let updatedAssignment = {};
      if (title) updatedAssignment.title = title;
      if (description) updatedAssignment.description = description;
      if (dueDate) updatedAssignment.dueDate = dueDate;

      let mongoResponse = await Assignments.updateAssignment(
        assignmentId,
        updatedAssignment
      );
      res.status(201).send(mongoResponse);
    } else res.status(404).send("Assignment not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Ver tarea - Profesor/Alumno
router.get("/:id", isLogged, async (req, res) => {
  try {
    let assignment = await Assignments.getAssignmentById(req.params.id);
    if (assignment) res.send(assignment);
    else res.status(404).send("Assignment not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Eliminar tarea - Profesor
router.delete("/:id", teacherPermissions, async (req, res) => {
  try {
    let assignment = await Assignments.deleteAssignment(req.params.id);
    if (assignment) res.send(assignment);
    else res.status(404).send("Assignment not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Ver mis tareas - Alumno
//router.get("/user/:userId/", async (req, res) => {});

// Ver tareas de un grupo - Alumno/Profesor
router.get("/group/:groupId/", isStudentOrTeacher, async (req, res) => {
  try {
    let { title, dateStart, dateEnd } = req.query;
    let filters = {};
    if (title) filters.title = new RegExp(title, "i");
    if (dateStart && dateEnd)
      filters.dueDate = { $gt: dateStart, $lt: dateEnd };
    else if (dateStart) filters.dueDate = { $gt: dateStart };
    else filters.dueDate = { $lt: dateEnd };

    let group = await Groups.getGroupById(req.params.groupId);
    filters._id = { $in: group.assignments };

    let assignments = await Assignments.getAssignments(filters);
    res.send(assignments);
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Calificar tarea - Evaluador
router.put("/evaluate/reviewer/:id", isLogged, async (req, res) => {
  try {
    let studentScore = req.body.studentScore;
    if (!studentScore) {
      res.status(400).send("Missing score");
      return;
    }
    let entrega = await Entregas.getEntregaById(req.params.id);
    if (entrega) {
      let studentToken = req.get("x-auth"),
        student = jwt.decode(studentToken);
      if (student._id != entrega.reviewer) {
        res.status(401).send("You're not authorized to review");
      } else {
        let mongoResponse = await Entregas.updateEntrega(req.params.id, {
          studentScore,
        });
        res.send(mongoResponse);
      }
    } else res.status(404).send("Entry not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Calificar tarea - Profesor
router.put("/evaluate/teacher/:id", teacherPermissions, async (req, res) => {
  try {
    let teacherScore = req.body.teacherScore;
    if (!teacherScore) {
      res.status(400).send("Missing score");
      return;
    }
    let entrega = await Entregas.getEntregaById(req.params.id);
    if (entrega) {
      let mongoResponse = await Entregas.updateEntrega(req.params.id, {
        teacherScore,
      });
      res.send(mongoResponse);
    } else res.status(404).send("Entry not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

module.exports = router;
