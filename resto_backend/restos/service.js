const RestoDAO = require("./models/dao");

class RestoService {
  constructor() {}

  create(objet, push = null) {
    // console.log("Push: ", push);
    return new Promise((resolve, reject) => {
      RestoDAO.insert(objet, push)
        .then(data => {
          if (!data) {
            return reject(null);
          }
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  justUpdate(query, target) {
    return new Promise((resolve, reject) => {
      RestoDAO.justUpdate(query, target)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  update(query, obj) {
    return new Promise((resolve, reject) => {
      RestoDAO.updateOne(query, obj)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  updateById(id, obj) {
    return new Promise((resolve, reject) => {
      RestoDAO.updateById(id, obj)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  get(query, options) {
    return new Promise((resolve, reject) => {
      RestoDAO.fetchOne(query, options)
        .then(data => {
          if (!data) {
            return reject(null);
          }
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  delete(query) {
    return RestoDAO.remove(query);
  }
  pushUpdate(query, object) {
    return new Promise((resolve, reject) => {
      RestoDAO.pushUpdate(query, object)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  genericUpdate(query, obj) {
    return new Promise((resolve, reject) => {
      RestoDAO.genericUpdate(query, { $pull: obj })
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  genericUpdateMany(query, obj) {
    return new Promise((resolve, reject) => {
      RestoDAO.genericUpdateMany(query, { $pull: obj })
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  getRestoLogo(query) {
    return new Promise((resolve, reject) => {
      this.get(query, { select: "photo" })
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
}

module.exports = new RestoService();
