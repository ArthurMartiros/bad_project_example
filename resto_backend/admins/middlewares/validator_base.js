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
      // email: function(req,next){
      //     if(!req.body.object.email || req.body.object.email == ''){
      //         req.ErroStatus = 400;
      //         req.Error = {error: 'missing or invalid required parameter object.email'};
      //         return next(req.error);
      //         // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
      //     }

      //     if(typeof req.body.object.email == 'string'){
      //         if(!validator.isEmail(req.body.object.email)){
      //             req.ErroStatus = 400;
      //             req.Error = {error: 'invalid required parameter object.email'};
      //             return next(req.error);
      //             // return res.status(400).send(errors.INVALID_EMAIL);
      //         }
      //     }else{
      //         req.ErroStatus = 400;
      //         req.Error = {error: 'invalid required parameter object.email'};
      //         return next(req.error);
      //     }
      // },

      phone: function(req, next) {
        if (!req.body.object.phone || req.body.object.phone == "") {
          req.ErroStatus = 400;
          req.Error = { error: "invalid required parameter object.phone" };
          return next(req.error);
          // return res.status(400).send(errors.INVALID_PHONE);
        }
      },
      password: function(req, next) {
        if (
          !req.body.object.password ||
          typeof req.body.object.password != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter object.password"
          };
          return next(req.error);
        }
        if (
          req.body.object.password.length < 3 ||
          req.body.object.password.length > 15
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "invalid required parameter object.password length"
          };
          return next(req.error);
        }
      }
      // fb_id: function(req,next){
      //     if(!req.body.object.password || typeof req.body.object.password != 'string'){
      //         req.ErroStatus = 400;
      //         req.Error = {error: 'missing or invalid required parameter object.fb_id'};
      //         return next(req.error);
      //     }
      // }
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
      member_id: function(req, next) {
        if (
          !req.body.query.member_id ||
          req.body.query.member_id == "" ||
          typeof req.body.query.member_id != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.member_id"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },
      _id: function(req, next) {
        if (
          !req.body.query._id ||
          req.body.query._id == "" ||
          typeof req.body.query._id != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query._id"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },
      phone: function(req, next) {
        if (
          !req.body.query.phone ||
          req.body.query.phone == "" ||
          typeof req.body.query.phone != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.phone"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },
      key: function(req, next) {
        if (
          !req.body.query.key ||
          req.body.query.key == "" ||
          typeof req.body.query.key != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.key"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },
      fb_id: function(req, next) {
        if (
          !req.body.query.fb_id ||
          req.body.query.fb_id == "" ||
          typeof req.body.query.fb_id != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.fb_id"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },
      email: function(req, next) {
        if (
          !req.body.query.email ||
          req.body.query.email == "" ||
          typeof req.body.query.email != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.email"
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

        if (typeof req.body.object.email == "string") {
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
      },
      role: function(req, next) {
        if (
          !req.body.object.role ||
          req.body.object.role == "" ||
          typeof req.body.object.role != "number"
        ) {
          req.ErroStatus = 400;
          req.Error = { error: "invalid required parameter object.role" };
          return next(req.error);
          // return res.status(400).send(errors.INVALID_PHONE);
        }
      },
      password: function(req, next) {
        if (
          !req.body.object.password ||
          typeof req.body.object.password != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter object.password"
          };
          return next(req.error);
        }
        if (
          req.body.object.password.length < 3 ||
          req.body.object.password.length > 15
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "invalid required parameter object.password length"
          };
          return next(req.error);
        }
        // if(!req.body.object.re_password || req.body.object.password != req.body.object.password){
        //     req.ErroStatus = 400;
        //     req.Error = {error: 'NO MATCHING PASSWORD TO RE-PASSWORD'};
        //     return next(req.error);
        // }
      }
    }
  },
  get: {
    query: {
      query: {
        _id: function(req, next) {
          if (
            !req.body.query._id ||
            req.body.query._id == "" ||
            typeof req.body.query._id != "string"
          ) {
            req.ErroStatus = 400;
            req.Error = {
              error: "missing or invalid required parameter query._id"
            };
            return next(req.error);
            // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
          }
        },
        phone: function(req, next) {
          if (
            !req.body.query.phone ||
            req.body.query.phone == "" ||
            typeof req.body.query.phone != "string"
          ) {
            req.ErroStatus = 400;
            req.Error = {
              error: "missing or invalid required parameter query.phone"
            };
            return next(req.error);
            // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
          }
        },
        key: function(req, next) {
          if (
            !req.body.query.key ||
            req.body.query.key == "" ||
            typeof req.body.query.key != "string"
          ) {
            req.ErroStatus = 400;
            req.Error = {
              error: "missing or invalid required parameter query.key"
            };
            return next(req.error);
            // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
          }
        },
        fb_id: function(req, next) {
          if (
            !req.body.query.fb_id ||
            req.body.query.fb_id == "" ||
            typeof req.body.query.fb_id != "string"
          ) {
            req.ErroStatus = 400;
            req.Error = {
              error: "missing or invalid required parameter query.fb_id"
            };
            return next(req.error);
            // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
          }
        },
        email: function(req, next) {
          if (
            !req.body.query.email ||
            req.body.query.email == "" ||
            typeof req.body.query.email != "string"
          ) {
            req.ErroStatus = 400;
            req.Error = {
              error: "missing or invalid required parameter query.email"
            };
            return next(req.error);
            // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
          }
        }
      }
    }
  },

  delete: {
    query: {
      member_id: function(req, next) {
        if (
          !req.body.query.member_id ||
          req.body.query.member_id == "" ||
          typeof req.body.query.member_id != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.member_id"
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
  getRestos: {
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
      phone: function(req, next) {
        if (
          !req.body.query.phone ||
          req.body.query.phone == "" ||
          typeof req.body.query.phone != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.phone"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },
      key: function(req, next) {
        if (
          !req.body.query.key ||
          req.body.query.key == "" ||
          typeof req.body.query.key != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.key"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },
      fb_id: function(req, next) {
        if (
          !req.body.query.fb_id ||
          req.body.query.fb_id == "" ||
          typeof req.body.query.fb_id != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.fb_id"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      },
      email: function(req, next) {
        if (
          !req.body.query.email ||
          req.body.query.email == "" ||
          typeof req.body.query.email != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.email"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      }
    }
  },
  addMemberToResto: {
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
      // email: function(req,next){
      //     if(!req.body.object.email || req.body.object.email == '' ){
      //         req.ErroStatus = 400;
      //         req.Error = {error: 'missing or invalid required parameter object.email'};
      //         return next(req.error);
      //         // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
      //     }

      //     if(typeof req.body.object.email == 'string'){
      //         if(!validator.isEmail(req.body.object.email)){
      //             req.ErroStatus = 400;
      //             req.Error = {error: 'invalid required parameter object.email'};
      //             return next(req.error);
      //             // return res.status(400).send(errors.INVALID_EMAIL);
      //         }
      //     }else{
      //         req.ErroStatus = 400;
      //         req.Error = {error: 'invalid required parameter object.email'};
      //         return next(req.error);
      //     }
      // },

      phone: function(req, next) {
        if (!req.body.object.phone || req.body.object.phone == "") {
          req.ErroStatus = 400;
          req.Error = { error: "invalid required parameter object.phone" };
          return next(req.error);
          // return res.status(400).send(errors.INVALID_PHONE);
        }
      },
      role: function(req, next) {
        if (
          !req.body.object.role ||
          req.body.object.role == "" ||
          typeof req.body.object.role != "number"
        ) {
          req.ErroStatus = 400;
          req.Error = { error: "invalid required parameter object.role" };
          return next(req.error);
          // return res.status(400).send(errors.INVALID_PHONE);
        }
      }
    }
  },
  validateUser: {
    query: {
      member_id: function(req, next) {
        if (
          !req.body.query.member_id ||
          req.body.query.member_id == "" ||
          typeof req.body.query.member_id != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter query.member_id"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      }
    },
    object: {
      password: function(req, next) {
        if (
          !req.body.object.password ||
          typeof req.body.object.password != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter object.password"
          };
          return next(req.error);
        }
        if (
          req.body.object.password.length < 3 ||
          req.body.object.password.length > 15
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "invalid required parameter object.password length"
          };
          return next(req.error);
        }
      },
      re_password: function(req, next) {
        if (
          !req.body.object.re_password ||
          typeof req.body.object.re_password != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter object.re_password"
          };
          return next(req.error);
        }
        if (
          req.body.object.re_password.length < 3 ||
          req.body.object.re_password.length > 15
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "invalid required parameter object.password length"
          };
          return next(req.error);
        }
      },
      fb_id: function(req, next) {
        if (
          !req.body.object.fb_id ||
          req.body.object.fb_id == "" ||
          typeof req.body.object.fb_id != "string"
        ) {
          req.ErroStatus = 400;
          req.Error = {
            error: "missing or invalid required parameter object.fb_id"
          };
          return next(req.error);
          // return res.status(400).send(errors.MISSING_REQUIRED_PARAMETER);
        }
      }
    }
  }
};
