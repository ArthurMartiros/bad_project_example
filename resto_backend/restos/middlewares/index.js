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
    if (!req.body || !req.body.query || req.body.query == {}) {
      return res
        .status(400)
        .send({ error: "missaing required parameter query" });
    }

    validator_base.create.query.admin(req, next);

    for (let [key, fun] of Object.entries(validator_base.create.object)) {
      if (!req.body.object[key]) {
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
      if (!req.body.query[key]) {
        return res
          .status(400)
          .send({ error: `missing required parameter ${key}` });
      }
      fun(req, next);
    }
    for (let [key, fun] of Object.entries(validator_base.update.object)) {
      if (req.body.object[key]) {
        fun(req, next);
      }
    }

    next();
  }

  get(req, res, next) {
    if (!req.body || !req.body.query || req.body.query == {}) {
      return res
        .status(400)
        .send({ error: "missaing required parameter query" });
    }

    for (let [key, fun] of Object.entries(validator_base.get.query)) {
      if (!req.body.query[key]) {
        return res
          .status(400)
          .send({ error: `missing required parameter ${key}` });
      }
      fun(req, next);
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
}

module.exports = new RestoMiddleWareReqValidator();
