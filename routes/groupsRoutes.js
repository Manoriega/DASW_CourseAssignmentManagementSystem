const router = require("express").Router();
const nanoid = require("nanoid");
const jwt = require("jsonwebtoken");
const { Groups } = require("../database/Groups");
const { Users } = require("../database/Users");
const {
  isLogged,
  onlyAdmin,
  teacherPermissions,
  isStudentOrTeacher,
} = require("../middlewares");

// Obtener todos los grupos a los que pertenece el estudiante o profesor
router.get("/", isLogged, async (req, res) => {
  let studentToken = req.get("x-auth"),
    student = jwt.decode(studentToken);
  let { title, code, published, teacher } = req.query;
  let filters = {};
  if (title) filters.title = new RegExp(title, "i");
  if (code) filters.code = new RegExp(code, "i");
  if (teacher) filters.teacher = new RegExp(teacher, "i");
  if (published) filters.published = published;

  try {
    let user = await Users.getUserByUid(student.uid);
    let groups =
      user.usertype == 3
        ? await Groups.getGroups(filters)
        : await Groups.getGroupsFromArray(user.groups);
    res.send(groups);
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Crear un grupo

router.post("/", onlyAdmin, async (req, res) => {
  let { title, code, information, teacher } = req.body;
  let errors = [];
  if (!title) errors.push("Title");
  if (!code) errors.push("Code");
  if (!information) errors.push("Information");
  if (!teacher) errors.push("Teacher");
  if (errors.length > 0) {
    res
      .status(400)
      .send(
        "Bad request: " + errors.map((error) => `Missing ${error}`).join(". ")
      );
    return;
  }
  let uid = nanoid.nanoid(8);
  let newGroup = {
    uid,
    title,
    code,
    information,
    teacher,
  };
  try {
    let mongoResponse = await Groups.createGroup(newGroup);
    await Users.addGroup(teacher, uid);
    res.status(201).send(mongoResponse);
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Reabrir un grupo

router.put("/:id/published", onlyAdmin, async (req, res) => {
  try {
    let group = await Groups.getGroupById(req.params.id);
    if (group) {
      let mongoResponse = await Groups.updateGroup(req.params.id, {
        published: true,
      });
      res.send(mongoResponse);
    } else res.status(404).send("Group not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Cerrar un grupo

router.delete("/:id/published", teacherPermissions, async (req, res) => {
  try {
    let group = await Groups.getGroupById(req.params.id);
    if (group) {
      let mongoResponse = await Groups.updateGroup(req.params.id, {
        published: false,
      });
      res.send(mongoResponse);
    } else res.status(404).send("Group not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Obtener un grupo

router.get("/:id", isStudentOrTeacher, async (req, res) => {
  try {
    let group = await Groups.getGroupById(req.params.id);
    if (group) res.send(group);
    else res.status(404).send("Group not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Obtener estudiantes que no están en el grupo

router.get("/:id/studentsToAdd", async (req, res) => {
  try {
    let students = await Users.studentsToAdd(req.params.id);
    res.send(students);
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Actualizar un grupo

router.put("/:id", onlyAdmin, async (req, res) => {
  try {
    let group = await Groups.getGroupById(req.params.id);
    if (group) {
      let { title, information, published } = req.body;
      let groupUpdated = {};
      if (title) groupUpdated.title = title;
      if (information) groupUpdated.information = information;
      if (published) groupUpdated.published = published;

      let mongoResponse = await Groups.updateGroup(req.params.id, groupUpdated);
      res.status(201).send(mongoResponse);
    } else res.status(404).send("Group not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Borrar un grupo

router.delete("/:id", onlyAdmin, async (req, res) => {
  try {
    let group = await Groups.getGroupById(req.params.id);
    if (group) {
      let mongoResponse = await Groups.deleteGroup(req.params.id);
      res.send(mongoResponse);
    } else res.status(404).send("Group not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Obtener estudiantes de un grupo

router.get("/:id/students", isStudentOrTeacher, async (req, res) => {
  try {
    let groupId = req.params.id;
    let group = await Groups.getGroupById(groupId);
    if (group) {
      res.send(group.students);
    } else res.status(404).send("Group not found");
  } catch (e) {
    res.status(400).send("An error has occurred");
    console.log(e);
  }
});

// Agregar estudiante a un grupo

router.post(
  "/:groupId/student/:studentId",
  teacherPermissions,
  async (req, res) => {
    try {
      let groupId = req.params.groupId,
        studentId = req.params.studentId;
      let group = await Groups.getGroupById(groupId);
      console.log(group);
      if (group) {
        let student = await Users.getUserById(studentId);
        console.log(student);
        if (student) {
          await Groups.addStudent(groupId, studentId);
          await Users.addGroup(studentId, groupId);
          res.status(201).send(`Student added`);
        } else res.status(404).send("Student not found");
      } else res.status(404).send("Group not found");
    } catch (e) {
      res.status(400).send("An error has occurred");
      console.log(e);
    }
  }
);

// Eliminar estudiante a un grupo

router.delete(
  "/:groupId/student/:studentId",
  teacherPermissions,
  async (req, res) => {
    try {
      let groupId = req.params.groupId,
        studentId = req.params.studentId;
      let group = await Groups.getGroupById(groupId);
      if (group) {
        let student = await Users.getUserById(studentId);
        if (student) {
          await Groups.removeStudent(groupId, studentId);
          await Users.removeGroup(studentId, groupId);
          res.status(201).send(`Student removed`);
        } else res.status(404).send("Student not found");
      } else res.status(404).send("Group not found");
    } catch (e) {
      res.status(400).send("An error has occurred");
      console.log(e);
    }
  }
);

module.exports = router;
