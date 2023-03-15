const express = require("express");
const indexRoutes = require("./routes/index");

const app = express();
const port = 3001;

app.use(express.json());

app.use("/", indexRoutes);

app.listen(port, () => console.log(`Running on http://localhost:${port}`));
