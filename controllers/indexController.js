class IndexController {
  async index(req, res) {
    res.send({ status: 1, msg: "Server is okay" });
  }
}

module.exports = new IndexController();
