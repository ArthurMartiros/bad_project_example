const BaseDAO = require("../../init/base_dao");
const FeeAndCallModel = require("./index.js");

class FeeAndCallDAO extends BaseDAO {
  constructor() {
    super("fee-call", FeeAndCallModel);
  }
}

module.exports = new FeeAndCallDAO();
