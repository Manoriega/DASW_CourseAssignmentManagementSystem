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
  handleExceptions,
} = require("../middlewares");

// Obtener todos los grupos a los que pertenece el estudiante o profesor. O ver todos siendo administrador
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
    handleExceptions(e, res);
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
    handleError(
      res,
      "Bad request: " + errors.map((error) => `Falta ${error}`).join(". ")
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
    await Users.addGroup(teacher, uid);
    let mongoResponse = await Groups.createGroup(newGroup);
    res.status(201).send(mongoResponse);
  } catch (e) {
    handleExceptions(e, res);
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
    handleExceptions(e, res);
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
    handleExceptions(e, res);
  }
});

// Obtener un grupo

router.get("/:groupId", isStudentOrTeacher, async (req, res) => {
  try {
    let group = await Groups.getGroupById(req.params.groupId);
    if (group) res.send(group);
    else res.status(404).send("Group not found");
  } catch (e) {
    handleExceptions(e, res);
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
    handleExceptions(e, res);
  }
});

// Borrar un grupo

router.delete("/:id", onlyAdmin, async (req, res) => {
  try {
    let group = await Groups.getGroupById(req.params.id);
    await Users.removeGroup(group.teacher._id, req.params.id);
    if (group) {
      let mongoResponse = await Groups.deleteGroup(req.params.id);
      res.send(mongoResponse);
    } else res.status(404).send("Group not found");
  } catch (e) {
    handleExceptions(e, res);
  }
});

// Obtener estudiantes de un grupo

router.get("/:groupId/students", isStudentOrTeacher, async (req, res) => {
  try {
    let groupId = req.params.groupId;
    let group = await Groups.getGroupById(groupId);
    if (group) {
      let students = await Users.getUsers({ uid: { $in: group.students } });
      res.send(students);
    } else res.status(404).send("Group not found");
  } catch (e) {
    handleExceptions(e, res);
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
        if (student) {
          await Groups.addStudent(groupId, studentId);
          await Users.addGroup(studentId, groupId);
          res.status(201).send(`Student added`);
        } else res.status(404).send("Student not found");
      } else res.status(404).send("Group not found");
    } catch (e) {
      handleExceptions(e, res);
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
      handleExceptions(e, res);
    }
  }
);

router.get("/:id/studentsToAdd", teacherPermissions, async (req, res) => {
  try {
    let users = await Users.getUsers({
      groups: { $nin: [req.params.id] },
      usertype: 1,
    });
    res.send(users);
  } catch (e) {
    handleExceptions(e, res);
  }
});

module.exports = router;
