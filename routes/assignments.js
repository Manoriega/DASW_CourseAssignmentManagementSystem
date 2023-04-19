let router = require("express").Router();
let path = require("path");
let formidable = require("formidable");
let archiver = require("archiver");
let fs = require("fs");

// Crear tarea - Profesor
router.post("/", async (req, res) => {});

// Subir tarea - Alumno
router.post("/submit/:id", (req, res) => {
  let form = new formidable.IncomingForm();

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
  });
});

router.get("/download/all/:assignmentid", async (req, res) => {});

router.get("/download/:assignmentEntry", async (req, res) => {});

// Editar tarea - Profesor
router.put("/:id", async (req, res) => {});

// Ver tarea - Profesor/Alumno
router.get("/:id", async (req, res) => {});

// Eliminar tarea - Profesor
router.delete("/:id", async (req, res) => {});

// Ver mis tareas - Alumno
router.get("/user/:userId/", async (req, res) => {});

// Ver tareas de un grupo - Alumno/Profesor
router.get("/group/:groupId/", async (req, res) => {});

// Calificar tarea - Profesor
router.put("/evaluate/:id", async (req, res) => {});

module.exports = router;
