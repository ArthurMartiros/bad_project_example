const validator = require("validator");
const errors = require("../../init/errors");

module.exports = {
  object: function(req, next) {
    if (!req.body || !req.body.object) {
      req.ErroStatus = 400;
      req.Error = { error: "missing required marameter object" };
      return next(req.error);
      // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
    }
    if (req.body.object == {}) {
      req.ErroStatus = 400;
      req.Error = { error: "invalid parameter object" };
      return next(req.error);
      //return res.status(400).send(errors.EMPTY_PARAMETER);
    }
  },
  query: function(req, next) {
    if (!req.body || !req.body.query) {
      req.ErroStatus = 400;
      req.Error = { error: "missaing required parameter query" };
      return next(req.error);
      // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
    }
    if (req.body.query == {}) {
      req.ErroStatus = 400;
      req.Error = { error: "invalid parameter query" };
      return next(req.error);
      //return res.status(400).send(errors.EMPTY_PARAMETER);
    }
  },
  create: {
    query: {
      admin: function(req, next) {
        if (
          !req.body.query.admin ||
          req.body.query.admin == "" ||
          typeof req.body.query.admin != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.admin"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      }
    },
    object: {
      name: function(req, next) {
        if (
          !req.body.object.name ||
          req.body.object.name == "" ||
          typeof req.body.object.name != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter object.name"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },
      email: function(req, next) {
        // if (!req.body.object.email || req.body.object.email == "") {
        //   console.log("email");
        //   req.ErroStatus = 400;
        //   req.Error = {
        //     error: "missing or invalid required parameter object.email"
        //   };
        //   return next(req.error);
        //   // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        // }
        // if (Array.isArray(req.body.object.email)) {
        //   for (let email of req.body.object.email) {
        //     if (!validator.isEmail(email) || typeof email != "string") {
        //       req.ErroStatus = 400;
        //       req.Error = {
        //         error:
        //           "invalid required parameter object.email in object.emails"
        //       };
        //       return next(req.error);
        //       // return res.status(400).send(errors.INVALID_EMAIL);
        //     }
        //   }
        // }
        // if (typeof req.body.object.email == "string") {
        //   if (!validator.isEmail(req.body.object.email)) {
        //     req.ErroStatus = 400;
        //     req.Error = { error: "invalid required parameter object.email" };
        //     return next(req.error);
        //     // return res.status(400).send(errors.INVALID_EMAIL);
        //   }
        // } else {
        //   req.ErroStatus = 400;
        //   req.Error = { error: "invalid required parameter object.email" };
        //   return next(req.error);
        // }
      },

      phone: function(req, next) {
        if (!req.body.object.phone || req.body.object.phone == "") {
          req.ErroStatus = 400;
          req.Error = { error: "invalid required parameter object.phone" };
          return next(req.error);
          // return res.status(400).send(errors.INVALID_PHONE);
        }
      }
    }
  },
  update: {
    query: {
      admin: function(req, next) {
        if (
          !req.body.query.admin ||
          req.body.query.admin == "" ||
          typeof req.body.query.admin != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.admin"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },
      resto_id: function(req, next) {
        if (
          !req.body.query.resto_id ||
          req.body.query.resto_id == "" ||
          typeof req.body.query.resto_id != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.resto_id"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      }
    },
    object: {
      name: function(req, next) {
        if (
          !req.body.object.name ||
          req.body.object.name == "" ||
          typeof req.body.object.name != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter object.name"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },
      email: function(req, next) {
        if (!req.body.object.email || req.body.object.email == "") {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter object.email"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
        if (Array.isArray(req.body.object.email)) {
          for (let email of req.body.object.email) {
            if (!validator.isEmail(email) || typeof email != "string") {
              req.ErroStatus = 400;
              req.Error = {
                error:
                  "invalid required parameter object.email in object.emails"
              };
              return next(req.error);
              // return res.status(400).send(errors.INVALID_EMAIL);
            }
          }
        } else if (typeof req.body.object.email == "string") {
          if (!validator.isEmail(req.body.object.email)) {
            req.ErroStatus = 400;
            req.Error = { error: "invalid required parameter object.email" };
            return next(req.error);
            // return res.status(400).send(errors.INVALID_EMAIL);
          }
        } else {
          req.ErroStatus = 400;
          req.Error = { error: "invalid required parameter object.email" };
          return next(req.error);
        }
      },

      phone: function(req, next) {
        if (!req.body.object.phone || req.body.object.phone == "") {
          req.ErroStatus = 400;
          req.Error = { error: "invalid required parameter object.phone" };
          return next(req.error);
          // return res.status(400).send(errors.INVALID_PHONE);
        }
      }
    }
  },
  get: {
    query: {
      resto_id: function(req, next) {
        if (
          !req.body.query.resto_id ||
          req.body.query.resto_id == "" ||
          typeof req.body.query.resto_id != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.resto_id"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },
      admin: function(req, next) {
        if (
          !req.body.query.admin ||
          req.body.query.admin == "" ||
          typeof req.body.query.admin != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.admin"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      }
    }
  },

  delete: {
    query: {
      resto_id: function(req, next) {
        if (
          !req.body.query.resto_id ||
          req.body.query.resto_id == "" ||
          typeof req.body.query.resto_id != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.resto_id"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },
      admin: function(req, next) {
        if (
          !req.body.query.admin ||
          req.body.query.admin == "" ||
          typeof req.body.query.admin != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.admin"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      }
    }
  }
};
