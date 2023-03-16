const dbManager = require("../singleton/dbManager");

const tableName = "new_table";

function index(req, res) {
  res.send({ status: 1, msg: "Server is okay" });
}

async function getDefault(req, res) {
  const db = dbManager.getManager();
  let selection = await db.selectAllTable(tableName);
  res.json(selection);
}

module.exports = { index, getDefault };
