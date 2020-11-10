const BaseDAO = require("../../init/base_dao");
const OrderHistory = require("./index.js");

class OrderHistoryDAO extends BaseDAO {
  constructor() {
    super("order-histories", OrderHistory);
  }
}

module.exports = new OrderHistoryDAO();
