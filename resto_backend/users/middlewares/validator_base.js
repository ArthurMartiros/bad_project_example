const validator = require("validator");
const errors = require("../../init/errors");

module.exports = {
  object: function(req, next) {
    if (!req.body || !req.body.object) {
      console.log("object");
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
      console.log("query");
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
    object: {
      name: function(req, next) {
        if (
          !req.body.object.name ||
          req.body.object.name == "" ||
          typeof req.body.object.name != "string"
        ) {
          console.log("name");
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter object.name"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },

      phone: function(req, next) {
        if (!req.body.object.phone || req.body.object.phone == "") {
          req.ErroStatus = 400;
          req.Error = { error: "invalid required parameter object.phone" };
          return next(req.error);
          // return res.status(400).send(errors.INVALID_PHONE);
        }
      },

      fb_id: function(req, next) {
        if (
          !req.body.object.fb_id ||
          typeof req.body.object.fb_id != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter object.fb_id"
          };
          return next(req.error);
        }
      },

      device_token: function(req, next) {
        if (
          !req.body.object.device_token ||
          typeof req.body.object.device_token != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter object.device_token"
          };
          return next(req.error);
        }
      },

      device_os: function(req, next) {
        if (
          !req.body.object.device_os ||
          typeof req.body.object.device_os != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter object.device_os"
          };
          return next(req.error);
        }
      }
    }
  },
  getOrderHistory: {
    query: {
      user_id: function(req, next) {
        if (
          !req.body.query.user_id ||
          req.body.query.user_id == "" ||
          typeof req.body.query.user_id != "string"
        ) {
          console.log("user_id");
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.user_id"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      }
      // resto_id: function(req,next){
      //         if(!req.body.query.resto_id || req.body.query.resto_id == '' || typeof req.body.query.resto_id != 'string'){
      //             console.log('name');
      //             req.ErroStatus = 400;
      //             req.Error = {error: 'missing or invalid required parameter query.resto_id'};
      //             return next(req.error);
      //             // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
      //         }
      // }
    }
  },
  getUserByPhone: {
    query: {
      phone: function(req, next) {
        if (
          !req.body.query.phone ||
          req.body.query.phone == "" ||
          typeof req.body.query.phone != "string"
        ) {
          console.log("phone");
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.phone"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      }
    }
  }
};
