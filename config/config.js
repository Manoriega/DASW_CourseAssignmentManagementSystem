const dotenv = require("dotenv").config();

let dbConfig = {
  dbUrl: function () {
    return `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y7ljhau.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
  },
};

module.exports = dbConfig;
