const AdminDAO = require("./models/dao");
const jwt = require("jsonwebtoken");

class AdminService {
  constructor() {}

  create(object, push = null) {
    return new Promise((resolve, reject) => {
      AdminDAO.insert(object, push)
        .then(data => {
          if (!data) {
            return reject(null);
          }
          return resolve(data);
        })
        .catch(err => {
          console.log(err);
          return reject(err);
        });
    });
  }
  update(query, obj) {
    return new Promise((resolve, reject) => {
      AdminDAO.updateOne(query, obj)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  pushUpdate(query, obj) {
    return AdminDAO.pushUpdate(query, obj);
  }
  get(query, options) {
    return new Promise((resolve, reject) => {
      AdminDAO.fetchOne(query, options)
        .then(data => {
          // if(!data){
          //     return reject(null);
          // }
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  getMany(query, options) {
    return new Promise((resolve, reject) => {
      AdminDAO.fetchMany(query, options)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(data);
        });
    });
  }
  delete(query) {
    return new Promise((resolve, reject) => {
      AdminDAO.remove(query)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  login(object) {}
  register(object) {
    this.create(object);
  }
  jwtSign(param) {
    return jwt.sign({ key: param }, process.env.SECRET, {
      expiresIn: 604800 // expires in 1 hours
    });
  }
  jwtVerify(token, cb) {
    jwt.verify(token, process.env.SECRET, cb);
  }
}

module.exports = new AdminService();
