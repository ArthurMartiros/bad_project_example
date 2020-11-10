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
      // No: function(req,next){
      //     if(!req.body.object.No || req.body.object.No == '' || typeof req.body.object.No != 'number'){
      //         console.log('name');
      //         req.ErroStatus = 400;
      //         req.Error = {error: 'missing or invalid required parameter object.No'};
      //         return next(req.error);
      //         // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
      //     }
      // },

      resto: function(req, next) {
        if (
          !req.body.object.resto ||
          req.body.object.resto == "" ||
          typeof req.body.object.resto != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = { error: "invalid required parameter object.resto" };
          return next(req.error);
          // return res.status(400).send(errors.INVALID_PHONE);
        }
      }
    }
  },

  delete: {
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

      // table_id: function(req,next){
      //     if(!req.body.query.table_id || req.body.query.table_id == '' || typeof req.body.query.table_id != 'string'){
      //         req.ErroStatus = 400;
      //         req.Error = {error: 'missing or invalid required parameter query.table_id'};
      //         return next(req.error);
      //         // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
      //     }
      // }
    }
  },
  getMany: {
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
    resto: function(req, next) {
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
  }
};
