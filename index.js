const express = require("express");
const indexRoutes = require("./routes/index");
const morgan = require("morgan");

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());

app.use("/", indexRoutes);

app.listen(port, () => console.log(`Running on http://localhost:${port}`));
