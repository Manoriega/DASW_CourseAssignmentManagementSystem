const router = require('express').Router();
const {Rubrica} = require('../database/rubrics');
const nanoid = require('nanoid');
const {validateRubricPost} = require('../middlewares/validation');
const jwt = require("jsonwebtoken");
const {
    isLogged,
    onlyAdmin,
    teacherPermissions,
    isStudentOrTeacher,
  } = require("../middlewares");


router.get('/', isLogged, async (req, res) => {
    let studentToken = req.get("x-auth"),
    student = jwt.decode(studentToken);
    try {

        let rubricas = await Rubrica.getRubricaById("nerdinvader67@gmail.com");
        res.send(rubricas); 
    }
    catch (e) {
        res.status(400).send("An error has occurred");
      }
    //res.status(200).send({Repuesta: "this is actually working"});
});

router.get("/:id", async (req, res) => {
  let rubrica = await Rubrica.getRubricaById(req.params.id);
  res.send(rubrica);
});

router.post("/", validateRubricPost, async (req, res) => {
  let { preguntas, owner, curso } = req.body;
  console.log(nanoid.nanoid());
  let newdoc = await Rubrica.addRubrica({
    uid: nanoid.nanoid(),
    preguntas,
    owner,
    curso,
  });
  res.status(201).send({ Repuesta: "se ha posteado esta rubrica" });
});

router.delete("/:id", async (req, res) => {
  let deletedDoc = await Rubrica.borrarRubrica(req.params.id);
  res.send(deletedDoc);
});

router.put("/:id", async (req, res) => {
  let { preguntas, owner, curso } = req.body;
  let updatedDoc = await Rubrica.actualizarRubrica(req.params.id, req.body);
  res.send(updatedDoc);
});

module.exports = router;
