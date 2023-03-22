const express = require("express");
const indexRoutes = require("./routes/index");
const morgan = require("morgan");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "/public")));
app.use("/", express.static(path.join(__dirname, "/public/html")));
app.use(morgan("dev"));
app.use(express.json());

app.use("/", indexRoutes);

app.listen(port, () => console.log(`Running on http://localhost:${port}`));
