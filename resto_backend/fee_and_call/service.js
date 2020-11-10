const FeeAndCallDAO = require("./models/dao");
class FeeAndCallService {
  constructor() {}
  make(obj) {
    return FeeAndCallDAO.insert(obj);
  }

  accept(_id, assignee) {
    return FeeAndCallDAO.updateOne(
      { _id },
      { is_order_accepted: true, assignee }
    );
  }

  get(_id) {
    return FeeAndCallDAO.fetchOne(
      { _id },
      {
        populate: {
          path: "client",
          select: "name"
        }
      }
    );
  }

  getAll() {
    return FeeAndCallDAO.fetchMany(
      {},
      {
        populate: {
          path: "client",
          select: "name"
        }
      }
    );
  }

  getFilteredByAccepted(is_order_accepted) {
    return FeeAndCallDAO.fetchMany(
      { is_order_accepted },
      {
        populate: {
          path: "client",
          select: "name"
        }
      }
    );
  }
}
module.exports = new FeeAndCallService();
