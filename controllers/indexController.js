const dbManager = require("../singleton/dbManager");

class IndexController {
  async index(req, res) {
    res.send({ status: 1, msg: "Server is okay" });
  }

  async getDefalt(req, res) {
    const db = dbManager.getManager();
    let selection = await db.selectAllTable("new_table");
    res.json(selection);
  }
}

module.exports = new IndexController();
