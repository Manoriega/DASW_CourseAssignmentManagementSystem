const express = require("express");
const morgan = require("morgan");
const path = require("path");

const assignmentsRoutes = require("./routes/assignments");
const groupsRoutes = require("./routes/groups");
const entriesRoutes = require("./routes/entries");
const usersRoutes = require("./routes/users");

const app = express();
const port = 3000;
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/public")));
app.use("/", express.static(path.join(__dirname, "/public/html")));
app.use(
  "/cursos/:id",
  express.static(path.join(__dirname, "/public/html/cursos/grupo/grupo.html"))
);
app.use(
  "/cursos/:grupoId/tareas",
  express.static(path.join(__dirname, "/public/html/tareas"))
);
app.use(
  "/cursos/:grupoId/estudiantes",
  express.static(path.join(__dirname, "/public/html/cursos/estudiantes"))
);
app.use(
  "/cursos/:grupoId/tareas/crear",
  express.static(path.join(__dirname, "/public/html/tareas/crear"))
);
app.use(
  "/cursos/:grupoId/tareas/:tareaId",
  express.static(path.join(__dirname, "/public/html/tarea/tarea.html"))
);
app.use(
  "/cursos/:grupoId/tareas/:tareaId/editar",
  express.static(path.join(__dirname, "/public/html/tareas/crear"))
);
app.use(
  "/cursos/:grupoId/tareas/:tareaId/entregas",
  express.static(path.join(__dirname, "/public/html/entregas"))
);
app.use(
  "/cursos/:grupoId/tareas/:tareaId/entregas/:entregaId",
  express.static(path.join(__dirname, "/public/html/entrega"))
);
app.use(
  "/cursos/:grupoId/tareas/:tareaId/entregas/:entregaId/evaluar",
  express.static(path.join(__dirname, "/public/html/evaluar"))
);

app.use("/api/assignments", assignmentsRoutes);
app.use("/api/entry", entriesRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/users", usersRoutes);

app.listen(port, () => console.log(`Running on http://localhost:${port}`));
