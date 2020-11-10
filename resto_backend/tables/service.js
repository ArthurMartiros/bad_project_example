const TableDAO = require("./models/dao");
const PhotoService = require("../photos/service");
const Errors = require("../init/errors");

class TableServices {
  constructor() {}

  create(objet, push = null) {
    console.log("Push: ", push);
    return new Promise((resolve, reject) => {
      TableDAO.insert(objet, push)
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
  update(query, obj) {
    return TableDAO.updateOne(query, obj);
  }

  get(query, options) {
    return new Promise((resolve, reject) => {
      TableDAO.fetchOne(query, options)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  getTablesCount(query) {
    return new Promise((resolve, reject) => {
      TableDAO.collectionCount(query)
        .then(count => {
          return resolve(count);
        })
        .catch(err => {
          console.log(err);
          return reject(err);
        });
    });
  }
  getMany(query, options) {
    return new Promise((resolve, reject) => {
      TableDAO.fetchMany(query, options)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          console.log(err);
          return reject(err);
        });
    });
  }
  delete(query) {
    return new Promise((resolve, reject) => {
      TableDAO.remove(query)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  pushUpdate(query, object) {
    return TableDAO.pushUpdate(query, object);
  }

  getQR(id, options) {
    return new Promise((resolve, reject) => {
      TableDAO.fetchOne({ _id: id })
        .then(table => {
          console.log("table == ", table);
          if (table.qr) {
            console.log("in");
            return resolve(table.qr);
          }
          console.log("out");

          return this.createQR(id, options);
        })
        .then(async photo => {
          if (!photo || !photo.id) {
            return reject(Errors.QR_FAILED);
          }
          await TableDAO.updateOne({ _id: id }, { qr: photo.id });
          return resolve(photo.id);
        })
        .catch(err => {
          console.log("Errrrrrrrrr: ", err);
          return reject(Errors.QR_FAILED);
        });
    });
  }

  createQR(id, options) {
    return new Promise((resolve, reject) => {
      PhotoService.importFromUrl(
        "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
          process.env.DOMAIN +
          "/qr?" +
          id +
          "/" +
          options.No,
        { table_id: id }
      )
        .then(photo => {
          console.log(photo);
          return resolve(photo);
        })
        .catch(err => {
          console.log(err);
          return reject(err);
        });
    });
  }
  removeMany(query) {
    return TableDAO.removeMany(query);
  }
}

module.exports = new TableServices();
