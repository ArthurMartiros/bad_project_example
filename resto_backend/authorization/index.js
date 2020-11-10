const vailidator = require("validator");
const errors = require("../init/errors");
const settings = require("../settings/app_settings");
const jwt = require("jsonwebtoken");
const response = require("../init/response");

function Authorize(req, res, next) {
  //   console.log("RRRRRRRRRRRRRRRR======>: ", req.body);
  jwt.verify(req.body.token, process.env.SECRET, function(err, decode) {
    if (err || (req.body.query.admin && decode.key != req.body.query.admin)) {
      console.log(err);
      return res
        .status(401)
        .send({ redirect: response.redirect.redirect_to_login });
    }
    next();
  });
}
function UpdateUserAuthoise(req, res, next) {
  if (req.body.query.admin) {
    jwt.verify(req.headers.token, process.env.SECRET, function(err, decode) {
      if (err || decode.key != req.body.query.admin) {
        console.log(err);
        return res
          .status(401)
          .send({ redirect: response.redirect.redirect_to_login });
      }
    });
  }
  next();
}

function isLogin(req, res) {
  if (!req.body.token || !req.body.user_id) {
    return res.status(401).send({ success: false });
  }
  jwt.verify(req.body.token, process.env.SECRET, function(err, decode) {
    if (err || (req.body.user_id && decode.key != req.body.user_id)) {
      console.log(err);
      return res.status(401).send({ success: false });
    }
    return res.status(200).send({ success: true });
  });
}
exports.Authorize = Authorize;
exports.UpdateUserAuthoise = UpdateUserAuthoise;
exports.isLogin = isLogin;
