let dbConfig = {
  user: "mauricionoriega",
  password: "y1TO6lZsnkj1gTxK",
  dbName: "casym",
  dbUrl: function () {
    return `mongodb+srv://${this.user}:${this.password}@cluster0.y7ljhau.mongodb.net/${this.dbName}?retryWrites=true&w=majority`;
  },
};

module.exports = dbConfig;
