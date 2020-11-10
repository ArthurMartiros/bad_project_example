const errors = require("../../init/errors");
const validator = require("validator");
const validator_base = require("./validator_base");

class RestoMiddleWareReqValidator {
  constructor() {}

  create(req, res, next) {
    if (!req.body || !req.body.object || req.body.object == {}) {
      console.log("object");
      return res
        .status(400)
        .send({ error: "missing required marameter object" });
    }

    for (let [key, fun] of Object.entries(validator_base.create.object)) {
      console.log(key);
      if (!req.body.object[key]) {
        console.log("Chuni");
        return res
          .status(400)
          .send({ error: `missing required parameter ${key}` });
      }
      fun(req, next);
    }
    next();
  }

  getOrderHistory(req, res, next) {
    if (!req.body || !req.body.query || req.body.query == {}) {
      console.log("query");
      return res
        .status(400)
        .send({ error: "missing required marameter query" });
    }
    for (let [key, fun] of Object.entries(
      validator_base.getOrderHistory.query
    )) {
      console.log(key);
      if (!req.body.query[key]) {
        return res
          .status(400)
          .send({ error: `missing required parameter ${key}` });
      }
      fun(req, next);
    }
    next();
  }

  getUserByPhone(req, res, next) {
    if (!req.body || !req.body.query || req.body.query == {}) {
      console.log("query");
      return res
        .status(400)
        .send({ error: "missing required parameter query" });
    }
    for (let [key, fun] of Object.entries(
      validator_base.getUserByPhone.query
    )) {
      console.log(key);
      if (!req.body.query[key]) {
        return res
          .status(400)
          .send({ error: `missing required parameter ${key}` });
      }
      fun(req, next);
    }
    next();
  }
}

module.exports = new RestoMiddleWareReqValidator();
