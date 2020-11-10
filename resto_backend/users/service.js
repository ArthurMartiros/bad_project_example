const UsersDAO = require("./models/dao");
const Errors = require("../init/errors");
const options = require("./configs/options");
var apn = require("apn");

class UserService {
  constructor() {}
  getUserById(id, options) {
    options = options || {};
    return new Promise((resolve, reject) => {
      UsersDAO.fetchOne({ _id: id }, options)
        .then(user => {
          if (!user) return reject(Errors.USER_NOT_FOUND);
          return resolve(user);
        })
        .catch(err => {
          console.log(err);
          return reject(Errors.USER_NOT_FOUND);
        });
    });
  }

  getUserByPhone(phone, options) {
    options = options || {};
    return new Promise((resolve, reject) => {
      UsersDAO.fetchOne({ phone: phone }, options)
        .then(user => {
          if (!user) return reject(Errors.USER_NOT_FOUND);
          return resolve(user);
        })
        .catch(err => {
          console.log(err);
          return reject(Errors.USER_NOT_FOUND);
        });
    });
  }
  getUserOrders(query, options) {
    options = options || {};
    options.select = "order_history";
    options.populate = {
      path: "order_history.resto",
      select: "_id name photo"
    };
    return new Promise((resolve, reject) => {
      UsersDAO.fetchMany(query, options)
        .then(user => {
          if (!user) return reject(Errors.USER_NOT_FOUND);
          return resolve(user);
        })
        .catch(err => {
          console.log(err);
          return reject(Errors.USER_NOT_FOUND);
        });
    });
  }
  updateUserOrders(query, obj) {
    return new Promise((resolve, reject) => {
      UsersDAO.pushUpdate(query, obj)
        .then(data => {
          if (!data) {
            return reject(Errors.USER_UPDATE_FAILED);
          }
          return resolve(data);
        })
        .catch(err => {
          console.log(err);
          return reject(Errors.USER_UPDATE_FAILED);
        });
    });
  }
  createUser(obj) {
    return new Promise((resolve, reject) => {
      UsersDAO.insert(obj)
        .then(doc => {
          return resolve(doc);
        })
        .catch(err => {
          console.log(err);
          return reject(Error.USER_EXISTS);
        });
    });
  }
  updateUser(_id, obj) {
    return UsersDAO.updateOne(
      {
        _id
      },
      obj
    );
  }
  sendPushNotification(msg, deviceToken, bundleId, msgPayload) {
    let apnProvider = new apn.Provider(options);
    // TODO: modify this to use error codes
    if (!deviceToken || !deviceToken.length) {
      return Promise.reject("Device token is not provided");
    }
    const title = msgPayload.title;
    delete msgPayload.title;
    /*{
      topic: bundleId,
      expiry: Math.floor(Date.now() / 1000) + 3600, // Expires 1 hour from now.
      messageFrom: "RestoBIZ",
      body: msg,
      title: title,
      sound: "default",
      badge: 1,
      "mutable-content": 1,
      "content-available": 1,
      "media-url": "",
      "apns-priority": 5,
      "apns-push-type": "background",
      payload: {
        data: msgPayload
      }
    } */
    let note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.rawPayload = {
      // messageFrom: "RestoBIZ",
      aps: {
        alert: {
          body: msg,
          title: title
        },
        sound: "default",
        badge: 1,
        "mutable-content": 1,
        "content-available": 1,
        "media-url": "",
        "apns-priority": 5,
        "apns-push-type": "background",
        data: msgPayload
      }
    };
    note.topic = bundleId;

    return new Promise((resolve, reject) => {
      console.log("Note Token===>: ", note, deviceToken);
      apnProvider
        .send(note, deviceToken)
        .then(result => {
          console.log("Resssult of push process=====>: ", result);
          result.failed.forEach(a => {
            console.log("Failed sent push===>: ", a.response);
          });
          return resolve(result);
          // see documentation for an explanation of result
        })
        .catch(err => {
          console.log("Errrrrrrrrrrrrrr===>; ", err);
          return reject(err);
        });
    });
  }
}

module.exports = new UserService();
