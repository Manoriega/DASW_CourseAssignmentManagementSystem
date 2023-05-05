const mongoose = require("mongoose");
const config = require("../config/config.js");

mongoose
  .connect(config.dbUrl(), { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => console.log("Not connected", err));

module.exports = { mongoose };
