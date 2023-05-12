const router = require("express").Router();
let path = require("path");
let formidable = require("formidable");
const jwt = require("jsonwebtoken");
const nanoid = require("nanoid");
let archiver = require("archiver");
let {
  teacherPermissions,
  isStudentOrTeacher,
  isLogged,
  handleError,
  handleExceptions,
} = require("../middlewares/index");
const { Groups } = require("../database/Groups");
const { Users } = require("../database/Users");
const { Assignments } = require("../database/Assignments");
const { Entregas } = require("../database/Entregas");
let fs = require("fs");

// Crear tarea - Profesor
router.post("/", teacherPermissions, async (req, res) => {
  let { title, description, dueDate, rubricId, groupId } = req.body;
  let errors = [];
  if (!title) errors.push("Title");
  if (!description) errors.push("Description");
  if (!dueDate) errors.push("Due date");
  if (!rubricId) errors.push("Rubric Id");
  if (!groupId) errors.push("Group Id");
  if (errors.length > 0) {
    handleError(
      res,
      "Bad request: " + errors.map((error) => `Falta ${error}`).join(". ")
    );
    return;
  }
  let newAssignment = { title, description, dueDate, rubricId };

  try {
    let mongoResponse = await Assignments.createAssignment(newAssignment);
    Groups.addAssignment(groupId, mongoResponse._id);
    res.status(201).send(mongoResponse);
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Subir tarea - Alumno
router.post("/submit/:id", isLogged, async (req, res) => {
  try {
    let form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) throw err;
      let { groupId } = fields;
      let errors = [];

      if (!groupId) errors.push("User");

      console.log(fields);

      if (errors.length > 0) {
        handleError(
          res,
          "Bad request: " + errors.map((error) => `Falta ${error}`).join(". ")
        );
        return;
      }

      let oldPath = files.pdf.filepath;
      let projectDir = path.join(__dirname, "..");
      let student = jwt.decode(req.get("x-auth"));
      let user = await Users.getUserById(student.id);

      let fileName =
        user.lastname.split(" ").join("") +
        user.name +
        nanoid.nanoid() +
        ".pdf";
      let newPath = path.join(projectDir, "uploads", fileName);

      let readStream = fs.createReadStream(oldPath);

      let writeStream = fs.createWriteStream(newPath);

      readStream.pipe(writeStream);

      writeStream.on("finish", () => {
        fs.unlink(oldPath, async (err) => {
          if (err) throw err;

          let student = jwt.decode(req.get("x-auth"));
          let group = await Groups.getGroupById(groupId);
          let students = await Users.getUsers({
            _id: { $in: group.students },
          });

          let reviewer = {};
          for (let i = 0; i < students.length; i++) {
            const studentL = students[i];
            console.log(studentL);
            if (studentL._id == student.id) continue;
            let entries = await Entregas.getEntregas({
              assignmentId: req.params.id,
              reviewer: studentL._id,
            });
            if (entries.length < 1) {
              reviewer = studentL._id;
              break;
            }
          }
          let newEntrega = {
            assignmentId: req.params.id,
            studentDeliver: student.id,
            reviewer,
            fileName,
          };
          let mongoResponse = await Entregas.createEntrega(newEntrega);
          res.status(201).send(mongoResponse);
        });
      });
    });
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Descargar todas las entregas - Profesor
router.get("/download/all/:assignmentid", async (req, res) => {
  try {
    let assignmentId = req.params.assignmentid;
    let assignment = await Assignments.getAssignmentById(assignmentId);
    let assignments = await Entregas.getEntregas({ assignmentId });
    let zipName = `Entregas-${assignment.title.split(" ").join("")}.zip`;
    let zipPath = path.join(__dirname, "..", "uploads", zipName);

    // Comprimir archivos
    let output = fs.createWriteStream(zipPath);
    let archive = archiver("zip", {
      zlib: { level: 9 },
    });
    output.on("close", function () {
      res.download(zipPath, zipName);
    });
    archive.on("error", function (err) {
      throw err;
    });
    archive.pipe(output);
    assignments.forEach((assignment) => {
      archive.append(
        fs.createReadStream(
          path.join(__dirname, "..", "uploads", assignment.fileName)
        ),
        {
          name: assignment.fileName,
        }
      );
    });
    archive.finalize();
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Descargar una entrega - profesor
router.get("/download/:assignmentEntry", async (req, res) => {
  try {
    let entrega = await Entregas.getEntregaById(req.params.assignmentEntry);
    if (entrega) {
      let filePath = path.join(__dirname, "../uploads", entrega.fileName);
      res.download(filePath);
    } else res.status(404).send("Entry not found");
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Descargar una entrega - estudiante
router.get("/reviewer/download/:assignmentEntry", async (req, res) => {
  try {
    let entrega = await Entregas.getEntregaById(req.params.assignmentEntry);
    if (entrega) {
      let filePath = path.join(__dirname, "../uploads", entrega.fileName);
      res.download(filePath, "Entrega.pdf");
    } else res.status(404).send("Entry not found");
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Ver todas las entregas - Profesor
router.get("/:id/entries", teacherPermissions, async (req, res) => {
  try {
    let assignment = await Assignments.getAssignmentById(req.params.id);
    if (assignment) {
      let entries = await Entregas.getEntregas({
        assignmentId: req.params.id,
      });
      entries = entries.filter((entry) => {
        let match = true;
        if (req.query.studentDeliver) {
          let regex = new RegExp(req.query.studentDeliver, "i");
          let deliverName = `${entry.studentDeliver.name} ${entry.studentDeliver.lastname}`;
          match = match && regex.test(deliverName);
        }
        if (req.query.dateStart) {
          let dateStart = new Date(req.query.dateStart);
          let dueDate = new Date(entry.creationDate);
          match = match && dueDate >= dateStart;
        }
        if (req.query.dateEnd) {
          let dateEnd = new Date(req.query.dateEnd);
          let dueDate = new Date(entry.creationDate);
          match = match && dueDate <= dateEnd;
        }
        return match;
      });
      res.send(entries);
    } else res.status(404).send("Assignment not found");
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Ver una entrega - Profesor/Alumno
router.get("/entry/:id", isLogged, async (req, res) => {
  try {
    let entry = await Entregas.getEntregaById(req.params.id);
    if (entry) res.send(entry);
    else res.status(404).send("Entry not found");
  } catch (e) {
    handleExceptions(e, res);
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
    handleExceptions(e, res);
  }
});

// Ver tarea - Profesor/Alumno
router.get("/:id", isLogged, async (req, res) => {
  try {
    let assignment = await Assignments.getAssignmentById(req.params.id);
    if (assignment) res.send(assignment);
    else res.status(404).send("Assignment not found");
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Eliminar tarea - Profesor
router.delete("/:id", teacherPermissions, async (req, res) => {
  try {
    let entregas = await Entregas.getEntregas({ assignmentId: req.params.id });
    if (entregas.length <= 0) {
      let assignment = await Assignments.deleteAssignment(req.params.id);
      if (assignment) res.send(assignment);
      else res.status(404).send("Assignment not found");
    } else {
      handleError(res, ["No se puede borrar. Ya existen entregas"]);
    }
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Ver tareas de un grupo - Alumno/Profesor
router.get("/group/:groupId/", isStudentOrTeacher, async (req, res) => {
  try {
    let { title, dateStart, dateEnd } = req.query;
    let filters = {};
    if (title) filters.title = new RegExp(title, "i");
    if (dateStart && dateEnd)
      filters.dueDate = { $gt: dateStart, $lt: dateEnd };
    else if (dateStart) filters.dueDate = { $gt: dateStart };
    else if (dateEnd) filters.dueDate = { $lt: dateEnd };

    let group = await Groups.getGroupById(req.params.groupId);
    filters._id = { $in: group.assignments };

    let assignments = await Assignments.getAssignments(filters);
    res.send(assignments);
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Calificar tarea - Evaluador
router.put("/evaluate/reviewer/:id", isLogged, async (req, res) => {
  try {
    let studentScore = req.body.studentScore;
    let review = req.body.review;
    if (!studentScore) {
      res.status(400).send("Missing score");
      return;
    }
    let entrega = await Entregas.getEntregaById(req.params.id);
    if (entrega) {
      let studentToken = req.get("x-auth"),
        student = jwt.decode(studentToken);
      if (student.id != entrega.reviewer._id) {
        res.status(401).send("You're not authorized to review");
      } else {
        let mongoResponse = await Entregas.updateEntrega(req.params.id, {
          studentScore: studentScore.toFixed(2),
          review,
        });
        res.send(mongoResponse);
      }
    } else res.status(404).send("Entry not found");
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Calificar tarea - Profesor
router.put("/evaluate/teacher/:id", teacherPermissions, async (req, res) => {
  try {
    let { teacherScore, comments } = req.body;
    if (!teacherScore) {
      res.status(400).send("Missing score");
      return;
    }
    let entrega = await Entregas.getEntregaById(req.params.id);
    if (entrega) {
      let mongoResponse = await Entregas.updateEntrega(req.params.id, {
        teacherScore,
        comments,
      });
      if (!mongoResponse.studentScore) {
        res.send(400).status("Missing student score");
        return;
      }
      let teacherFinalScore = 8 * (mongoResponse.teacherScore / 10),
        studentFinalScore = 2 * (mongoResponse.studentScore / 10),
        finalScore = teacherFinalScore + studentFinalScore;
      let finalScoreResponse = await Entregas.updateEntrega(req.params.id, {
        finalScore: finalScore.toFixed(2),
      });
      res.send(finalScoreResponse);
    } else res.status(404).send("Entry not found");
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Tareas hechas - usuario
router.get("/done/:groupId", isStudentOrTeacher, async (req, res) => {
  let { title, dateStart, dateEnd } = req.query;
  let filters = {};
  if (title) filters.title = new RegExp(title, "i");
  if (dateStart && dateEnd) filters.dueDate = { $gt: dateStart, $lt: dateEnd };
  else if (dateStart) filters.dueDate = { $gt: dateStart };
  else if (dateEnd) filters.dueDate = { $lt: dateEnd };
  try {
    let groupId = req.params.groupId,
      studentToken = req.get("x-auth"),
      student = jwt.decode(studentToken),
      group = await Groups.getGroupById(groupId),
      assignments = group.assignments,
      todo = [];
    for (let assignment of assignments) {
      let entregas = await Entregas.getEntregas({
        assignmentId: assignment._id,
        studentDeliver: student.id,
      });
      if (entregas.length == 1) {
        todo = todo.concat(entregas);
      }
    }
    res.send(todo);
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Tareas por hacer - usuario
router.get("/toDo/:groupId", isStudentOrTeacher, async (req, res) => {
  try {
    let groupId = req.params.groupId,
      studentToken = req.get("x-auth"),
      student = jwt.decode(studentToken),
      group = await Groups.getGroupById(groupId),
      assignments = group.assignments,
      fecha = new Date();

    assignments = assignments.filter((assignment) => {
      let match = true;
      if (req.query.title) {
        let regex = new RegExp(req.query.title, "i");
        match = match && regex.test(assignment.title);
      }
      if (req.query.dateStart) {
        let dateStart = new Date(req.query.dateStart);
        let dueDate = new Date(assignment.dueDate);
        console.log(dueDate);
        console.log(dateStart);
        console.log(dueDate >= dateStart);
        match = match && dueDate >= dateStart;
      }
      if (req.query.dateEnd) {
        let dateEnd = new Date(req.query.dateEnd);
        let dueDate = new Date(assignment.dueDate);
        match = match && dueDate <= dateEnd;
      }
      if (!req.query.dateStart && !req.query.dateEnd) {
        let dateStart = fecha;
        let dueDate = new Date(assignment.dueDate);
        match = match && dueDate >= dateStart;
      }
      return match;
    });

    let todo = [];
    for (let assignment of assignments) {
      let entregas = await Entregas.getEntregas({
        assignmentId: assignment._id,
        studentDeliver: student.id,
      });
      if (entregas.length === 0) {
        todo.push(assignment);
      }
    }
    res.send(todo);
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Tareas por evaluar - maestro
router.get(
  "/toreview/teacher/:groupId",
  teacherPermissions,
  async (req, res) => {
    try {
      let filters = {};
      let group = await Groups.getGroupById(req.params.groupId);
      filters._id = { $in: group.assignments };
      let assignments = await Assignments.getAssignments(filters);
      let entries = [];
      for (let i = 0; i < assignments.length; i++) {
        let assignment = assignments[i];
        let assignmentEntries = await Entregas.getEntregas({
          assignmentId: assignment.id,
        });
        assignmentEntries = assignmentEntries.filter(
          (entry) => entry.teacherScore === null && entry.studentScore !== null
        );
        entries = entries.concat(assignmentEntries);
      }
      res.send(entries);
    } catch (e) {
      handleExceptions(e, res);
    }
  }
);

// Tareas por evaluar - usuario
router.get("/toreview/:groupId", isStudentOrTeacher, async (req, res) => {
  try {
    let groupId = req.params.groupId,
      studentToken = req.get("x-auth"),
      student = jwt.decode(studentToken),
      group = await Groups.getGroupById(groupId),
      assignments = group.assignments,
      toreview = [];
    for (let assignment of assignments) {
      let entregas = await Entregas.getEntregas({
        assignmentId: assignment._id,
        reviewer: student.id,
      });
      if (entregas.length == 1 && entregas[0].studentScore == null) {
        toreview = toreview.concat(entregas);
      }
    }
    res.send(toreview);
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Entrega por tarea y usuario
router.get("/:id/entry", isLogged, async (req, res) => {
  try {
    let assignment = await Assignments.getAssignmentById(req.params.id);
    if (assignment) {
      let studentToken = req.get("x-auth"),
        student = jwt.decode(studentToken);
      let entry = await Entregas.getEntregas({
        assignmentId: assignment._id,
        studentDeliver: student.id,
      });
      if (entry && entry.length == 1) res.send(entry[0]);
      else res.status(404).send("Entry not found");
    } else res.status(404).send("Assignment not found");
  } catch (e) {
    handleExceptions(e, res);
  }
});

module.exports = router;
