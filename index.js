const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const path = require("path");
const groupRoutes = require("./routes/groupsRoutes");
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const rubricaRoute = require("./routes/rubricas-routes");
const assignmentsRoutes = require("./routes/assignmentsRoutes");
const cookieParser = require("cookie-parser");
const { onlyAdminLogged } = require("./middlewares/index");

const app = express();
const port = proccess.env.PORT || 3000;
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  "/admin",
  onlyAdminLogged,
  express.static(path.join(__dirname, "/public/html/admin"))
);
app.use(express.static(path.join(__dirname, "/public")));
app.use("/", express.static(path.join(__dirname, "/public/html")));
app.use("/public/js", express.static(path.join(__dirname, "/public/js")));
app.use(
  "/cursos/:id",
  express.static(path.join(__dirname, "/public/html/cursos/grupo/grupo.html"))
);
app.use(
  "/cursos/:id/editar",
  express.static(path.join(__dirname, "/public/html/cursos/crear"))
);
app.use(
  "/cursos/:grupoId/tareas",
  express.static(path.join(__dirname, "/public/html/tareas"))
);
app.use(
  "/cursos/:grupoId/participantes",
  express.static(path.join(__dirname, "/public/html/cursos/participantes"))
);
app.use(
  "/cursos/:grupoId/tareas/crear",
  express.static(path.join(__dirname, "/public/html/tareas/crear"))
);
app.use(
  "/cursos/:grupoId/tareas/editar",
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

app.use(
  "/rubricas",
  express.static(path.join(__dirname, "/public/html/rubricas"))
);

app.use("/api/rubricas", rubricaRoute);
app.use("/api/groups", groupRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/rubricas", rubricaRoute);
app.use("/api/assignments", assignmentsRoutes);

app.use(
  "/rubricas",
  express.static(path.join(__dirname, "/public/html/rubricas"))
);
app.use(
  "/rubricas/:id",
  express.static(path.join(__dirname, "/public/html/rubricas/detallerubrica"))
);

app.use(
  "/rubricas",
  express.static(path.join(__dirname, "/public/html/rubricas"))
);

app.use(
  "/rubricas/crearRubrica",
  express.static(path.join(__dirname, "/public/html/rubricas/crearRubricas"))
);

app.use(
  "/rubricas/editar/:id",
  express.static(path.join(__dirname, "/public/html/rubricas/editarRubrica"))
);

app.use("/api/rubricas", rubricaRoute);
app.listen(port, () => console.log(`Running on http://localhost:${port}`));
