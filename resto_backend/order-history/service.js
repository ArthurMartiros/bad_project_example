OrderHistoryDAO = require("./models/dao");

class OrederHistoryService {
  constructor() {}

  createOrder(obj, push = null) {
    return new Promise((resolve, reject) => {
      OrderHistoryDAO.insert(obj, push)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getOrder(query, options) {
    return new Promise((resolve, reject) => {
      OrderHistoryDAO.fetchOne({ _id: query.order_id }, options)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  getAllOrders(query, options) {
    return new Promise((resolve, reject) => {
      OrderHistoryDAO.fetchMany(query, options)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  orderAccepted(query) {
    return new Promise((resolve, reject) => {
      OrderHistoryDAO.updateOne(
        {
          _id: query.order_id
        },
        {
          is_order_accepted: true,
          assignee: {
            assignee_id: query.member_id,
            name: query.member_name
          }
        }
      )
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getOrdersCount(query) {
    return new Promise((resolve, reject) => {
      OrderHistoryDAO.collectionCount(query)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(data);
        });
    });
  }
}

module.exports = new OrederHistoryService();
