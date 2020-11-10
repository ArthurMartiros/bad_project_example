const errors = require("../../init/errors");
const validator = require("validator");
const validator_base = require("./validator_base");

class RestoMiddleWareReqValidator {
  constructor() {}

  create(req, res, next) {
    if (!req.body || !req.body.object || req.body.object == {}) {
      return res
        .status(400)
        .send({ error: "missing required marameter object" });
    }

    for (let [key, fun] of Object.entries(validator_base.create.object)) {
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
  update(req, res, next) {
    if (!req.body || !req.body.object || req.body.object == {}) {
      return res
        .status(400)
        .send({ error: "missing required marameter object" });
    }
    if (!req.body || !req.body.query || req.body.query == {}) {
      return res
        .status(400)
        .send({ error: "missaing required parameter query" });
    }

    for (let [key, fun] of Object.entries(validator_base.update.query)) {
      if (req.body.query.hasOwnProperty(key)) {
        fun(req, next);
      }
    }
    for (let [key, fun] of Object.entries(validator_base.update.object)) {
      if (req.body.object.hasOwnProperty(key)) {
        fun(req, next);
      }
    }

    next();
  }

  get(req, res, next) {
    if (!req.body || !req.body.query || req.body.query == {}) {
      return res
        .status(400)
        .send({ error: "missing required parameter query" });
    }

    for (let [key, fun] of Object.entries(validator_base.update.query)) {
      if (req.body.query.hasOwnProperty(key)) {
        fun(req, next);
      }
    }
    next();
  }

  delete(req, res, next) {
    if (!req.body || !req.body.query || req.body.query == {}) {
      return res
        .status(400)
        .send({ error: "missaing required parameter query" });
    }
    for (let [key, fun] of Object.entries(validator_base.delete.query)) {
      if (!req.body.query[key]) {
        return res
          .status(400)
          .send({ error: `missing required parameter ${key}` });
      }
      fun(req, next);
    }
    next();
  }

  getRestos(req, res, next) {
    if (!req.body || !req.body.query || req.body.query == {}) {
      return res
        .status(400)
        .send({ error: "missaing required parameter query" });
    }
    for (let [key, fun] of Object.entries(validator_base.getRestos.query)) {
      console.log(key);
      if (req.body.query.hasOwnProperty(key)) {
        fun(req, next);
      }
    }
    next();
  }

  addMemberToResto(req, res, next) {
    if (!req.body || !req.body.object || req.body.object == {}) {
      return res
        .status(400)
        .send({ error: "missing required marameter object" });
    }
    if (!req.body || !req.body.query || req.body.query == {}) {
      return res
        .status(400)
        .send({ error: "missaing required parameter query" });
    }
    for (let [key, fun] of Object.entries(
      validator_base.addMemberToResto.query
    )) {
      console.log(key);
      if (!req.body.query[key]) {
        return res
          .status(400)
          .send({ error: `missing required parameter ${key}` });
      }
      fun(req, next);
    }
    for (let [key, fun] of Object.entries(
      validator_base.addMemberToResto.object
    )) {
      console.log(key);
      if (!req.body.object[key]) {
        return res
          .status(400)
          .send({ error: `missing required parameter ${key}` });
      }
      fun(req, next);
    }
    next();
  }
  login(req, res, next) {
    if (!req.body || !req.body.object || req.body.object == {}) {
      return res
        .status(400)
        .send({ error: "missing required marameter object" });
    }
    next();
  }
  validateUser(req, res, next) {
    if (!req.body || !req.body.object || req.body.object == {}) {
      return res
        .status(400)
        .send({ error: "missing required marameter object" });
    }
    if (!req.body || !req.body.query || req.body.query == {}) {
      return res
        .status(400)
        .send({ error: "missaing required parameter query" });
    }
    validator_base.validateUser.query.member_id(req, next);
    for (let [key, fun] of Object.entries(validator_base.validateUser.object)) {
      console.log(key);
      if (!req.body.object[key]) {
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
