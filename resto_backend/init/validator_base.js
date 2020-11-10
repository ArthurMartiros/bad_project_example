const validator = require("validator");
const errors = require("../../init/errors");

module.exports = {
  object: function(req, next) {
    if (!req.body || !req.body.object) {
      req.ErroStatus = 400;
      req.Error = errors.MISSING_REQUIRED_PARAMETER;
      return next(req.error);
      // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
    }
    if (req.body.object == {}) {
      req.ErroStatus = 400;
      req.Error = errors.EMPTY_PARAMETER;
      return next(req.error);
      //return res.status(400).send(errors.EMPTY_PARAMETER);
    }
  },
  query: function(req, next) {
    if (!req.body || !req.body.query) {
      req.ErroStatus = 400;
      req.Error = errors.MISSING_REQUIRED_PARAMETER;
      return next(req.error);
      // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
    }
    if (req.body.query == {}) {
      req.ErroStatus = 400;
      req.Error = errors.EMPTY_PARAMETER;
      return next(req.error);
      //return res.status(400).send(errors.EMPTY_PARAMETER);
    }
  },
  name: function(req, next) {
    if (!req.body.object.name || req.body.object.name == "") {
      req.ErroStatus = 400;
      req.Error = errors.MISSING_REQUIRED_PARAMETER;
      return next(req.error);
      // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
    }
  },
  email: function(req, next) {
    if (!req.body.object.email || req.body.object.email == "") {
      req.ErroStatus = 400;
      req.Error = errors.MISSING_REQUIRED_PARAMETER;
      return next(req.error);
      // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
    }
    if (Array.isArray(req.body.object.email)) {
      for (let email of req.body.object.email) {
        if (!validator.isEmail(email)) {
          req.ErroStatus = 400;
          req.Error = errors.INVALID_EMAIL;
          return next(req.error);
          // return res.status(400).send(errors.INVALID_EMAIL);
        }
      }
    }
    if (typeof req.body.object.email == "string") {
      if (!validator.isEmail(req.body.object.email)) {
        req.ErroStatus = 400;
        req.Error = errors.INVALID_EMAIL;
        return next(req.error);
        // return res.status(400).send(errors.INVALID_EMAIL);
      }
    }
  },

  phone: function(req, next) {
    if (Array.isArray(req.body.object.phone)) {
      for (let phone of req.body.object.phone) {
        if (!validator.isMobilePhone(phone)) {
          req.ErroStatus = 400;
          req.Error = errors.INVALID_PHONE;
          return next(req.error);

          // return res.status(400).send(errors.INVALID_PHONE);
        }
      }
    }
    if (typeof req.body.object.phone == "string") {
      if (!validator.isMobilePhone(phone)) {
        req.ErroStatus = 400;
        req.Error = errors.INVALID_PHONE;
        return next(req.error);
        // return res.status(400).send(errors.INVALID_PHONE);
      }
    }
  },

  admin: function(req, next) {
    if (!req.body.object.admin || req.body.object.admin == "") {
      req.ErroStatus = 400;
      req.Error = errors.MISSING_REQUIRED_PARAMETER;
      return next(req.error);
      // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
    }
  },
  name: function(req, next) {
    if (!req.body.object.name || req.body.object.name == "") {
      req.ErroStatus = 400;
      req.Error = errors.MISSING_REQUIRED_PARAMETER;
      return next(req.error);
      // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
    }
  },
  email: function(req, next) {
    if (!req.body.object.email || req.body.object.email == "") {
      req.ErroStatus = 400;
      req.Error = errors.MISSING_REQUIRED_PARAMETER;
      return next(req.error);
      // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
    }
    if (Array.isArray(req.body.object.email)) {
      for (let email of req.body.object.email) {
        if (!validator.isEmail(email)) {
          req.ErroStatus = 400;
          req.Error = errors.INVALID_EMAIL;
          return next(req.error);
          // return res.status(400).send(errors.INVALID_EMAIL);
        }
      }
    }
    if (typeof req.body.object.email == "string") {
      if (!validator.isEmail(req.body.object.email)) {
        req.ErroStatus = 400;
        req.Error = errors.INVALID_EMAIL;
        return next(req.error);
        // return res.status(400).send(errors.INVALID_EMAIL);
      }
    }
  },

  phone: function(req, next) {
    if (Array.isArray(req.body.object.phone)) {
      for (let phone of req.body.object.phone) {
        if (!validator.isMobilePhone(phone)) {
          req.ErroStatus = 400;
          req.Error = errors.INVALID_PHONE;
          return next(req.error);

          // return res.status(400).send(errors.INVALID_PHONE);
        }
      }
    }
    if (typeof req.body.object.phone == "string") {
      if (!validator.isMobilePhone(phone)) {
        req.ErroStatus = 400;
        req.Error = errors.INVALID_PHONE;
        return next(req.error);
        // return res.status(400).send(errors.INVALID_PHONE);
      }
    }
  },

  admin: function(req, next) {
    if (!req.body.object.admin || req.body.object.admin == "") {
      req.ErroStatus = 400;
      req.Error = errors.MISSING_REQUIRED_PARAMETER;
      return next(req.error);
      // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
    }
  },
  tables: function(req, next) {
    if (
      !req.body.object.tables ||
      req.body.object.tables == [] ||
      req.body.object.tables == {} ||
      req.body.object.tables == ""
    ) {
      req.ErroStatus = 400;
      req.Error = errors.MISSING_REQUIRED_PARAMETER;
      return next(req.error);
    }
  },
  menus: function(req, next) {
    if (
      !req.body.object.menus ||
      req.body.object.menus == [] ||
      req.body.object.menus == {} ||
      req.body.object.menus == ""
    ) {
      req.ErroStatus = 400;
      req.Error = errors.MISSING_REQUIRED_PARAMETER;
      return next(req.error);
    }
  },
  photos: function(req, next) {
    if (
      !req.body.object.photos ||
      req.body.object.photos == [] ||
      req.body.object.photos == {} ||
      req.body.object.photos == ""
    ) {
      req.ErroStatus = 400;
      req.Error = errors.MISSING_REQUIRED_PARAMETER;
      return next(req.error);
    }
  }
};
