const database = require("../classes/database");

const dbManager = (() => {
  /**
   * @type manager
   */
  let singletonManager;
  return {
    getManager: () => {
      if (singletonManager == null) {
        singletonManager = new database();
      }
      return singletonManager;
    },
  };
})();
module.exports = dbManager;
