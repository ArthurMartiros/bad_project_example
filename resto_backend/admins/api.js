const router = require("express").Router();
const md5 = require("md5");
const routes = require("./routes");
const AdminServices = require("./service");
const RestoService = require("../restos/service");
const errors = require("../init/errors");
const authorize = require("../authorization");
const configs = require("./configs");
const AdminMiddlewares = require("./middlewares/index");
const response = require("../init/response");
router.post(
  `/admin/${routes.REGISTER}`,
  AdminMiddlewares.create,
  AdminMiddlewares.login,
  (req, res) => {
    // {
    //     object:{
    //             name
    //             phone
    //             email //optional
    //             password
    //             re_password
    //             fb_id
    //     }
    // }
    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    if (req.body.object.password != req.body.object.re_password) {
      return res
        .status(400)
        .send({ error: response.error.no_matching_password_re_password });
    }

    delete req.body.object.re_password;
    console.log(req.body.object);
    req.body.object.password = md5(req.body.object.password);
    req.body.object.verified = true;

    AdminServices.get({ phone: req.body.object.phone, verified: false })
      .then(data => {
        if (data) {
          AdminServices.update(
            { phone: req.body.object.phone },
            {
              password: req.body.object.password,
              fb_id: req.body.object.fb_id,
              verified: req.body.object.verified
            }
          )
            .then(() => {
              return res.status(200).send({ success: true });
            })
            .catch(err => {
              console.log(err);
              return res
                .status(400)
                .send({ error: response.error.failed_process });
            });
        } else {
          AdminServices.create(req.body.object)
            .then(data => {
              if (!data) {
                return res
                  .status(400)
                  .send({ error: response.error.failed_process });
              }
              return res.status(200).send({ success: true });
            })
            .catch(err => {
              console.log(err);
              return res
                .status(400)
                .send({ error: response.error.failed_process });
            });
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(400).send({ error: response.error.failed_process });
      });
  }
);

router.post(`/admin/${routes.LOGIN}`, AdminMiddlewares.login, (req, res) => {
  // {
  //     object:{
  //         phone
  //         password //conditional
  //     }
  // }

  console.log(req.body);
  AdminServices.get(
    { phone: req.body.object.phone.toString() },
    {
      populate: { path: "restos", select: "-admins -menu" }
    }
  )
    .then(data => {
      if (data) {
        if (!data.verified) {
          let temp = {
            name: data.name,
            _id: data._id,
            phone: data.phone
          };
          return res
            .status(202)
            .send({ redirect: response.redirect.set_password, data: temp });
        } else {
          if (req.body.object.password) {
            if (md5(req.body.object.password) == data.password) {
              const restos = data.role >= 3 && data.restos;
              let temp = {
                name: data.name,
                _id: data._id,
                fb_id: data.fb_id,
                phone: data.phone,
                role: data.role,
                verified: data.verified,
                key: data.key,
                restos
              };
              let token = AdminServices.jwtSign(data._id);
              return res
                .status(200)
                .send({ success: true, data: temp, token: token });
            } else {
              return res
                .status(401)
                .send({ error: response.error.invalid_login_parameter });
            }
          } else {
            let temp = {
              name: data.name,
              _id: data._id,
              fb_id: data.fb_id,
              phone: data.phone,
              role: data.role,
              verified: data.verified
            };
            return res
              .status(202)
              .send({ redirect: response.redirect.send_password, data: temp });
          }
        }
      } else {
        return res
          .status(401)
          .send({ error: response.error.no_such_user_please_register });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(400).send({ error: response.error.failed_process });
    });
});

router.put(
  `/admin/${routes.UPDATE_USER}`,
  AdminMiddlewares.update,
  authorize.Authorize,
  (req, res) => {
    // {
    //     query:{
    //         admin// optional if user member get update by administrator
    //         member_id
    //     }
    //     object:{
    //         name OR phne OR role OR email OR password
    //     }
    // }
    console.log(req.body.query);
    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    if (req.body.object.password) {
      if (req.body.object.password != req.body.object.re_password) {
        return res
          .status(400)
          .send({ error: response.error.no_matching_password_re_password });
      }
      req.body.object.password = md5(req.body.object.password);
      req.body.object.verified = true;
    }
    if (req.body.query.admin) {
      AdminServices.get({ _id: req.body.query.admin }, { select: "role" })
        .then(data => {
          AdminServices.get(
            { _id: req.body.query.member_id },
            { select: "role" }
          )
            .then(change => {
              if (change && data.role < change.role) {
                AdminServices.update(
                  { _id: req.body.query.member_id },
                  req.body.object
                )
                  .then(data => {
                    return res.status(200).send({ success: true });
                  })
                  .catch(err => {
                    console.log(err);
                    return res
                      .status(400)
                      .send({ error: response.error.user_update_failed });
                  });
              } else {
                return res
                  .status(401)
                  .send({ error: response.error.permision_denied });
              }
            })
            .catch(err => {
              console.log(err);
              return res
                .status(400)
                .send({ error: response.error.failed_process });
            });
        })
        .catch(err => {
          console.log(err);
          return res.status(400).send({ error: response.error.failed_process });
        });
    } else {
      if (req.body.object.role) {
        return res.status(401).send({
          error: response.error.permision_denied_you_cant_change_your_role
        });
      }
      console.log(req.body);
      AdminServices.update({ _id: req.body.query.member_id }, req.body.object)
        .then(data => {
          return res.status(200).send({ success: true });
        })
        .catch(err => {
          return res
            .status(400)
            .send({ error: response.error.user_update_failed });
        });
    }
  }
);

router.post(`/admin/${routes.UPDATE_TOKEN}`, (req, res) => {
  AdminServices.update({ _id: req.body.query.member_id }, req.body.object)
    .then(data => {
      return res.status(200).send({ success: true });
    })
    .catch(err => {
      return res.status(400).send({ error: response.error.user_update_failed });
    });
});

router.put(
  `/admin/${routes.VERIFY_USER}`,
  AdminMiddlewares.validateUser,
  (req, res) => {
    // {
    //     query:{
    //         member_id
    //     }
    //     object:{
    //         password
    //         re_password
    //         fb_id
    //     }
    // }
    console.log(req.body.query);
    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    if (req.body.object.password) {
      if (req.body.object.password != req.body.object.re_password) {
        return res
          .status(400)
          .send({ error: response.error.no_matching_password_re_password });
      }
      req.body.object.password = md5(req.body.object.password);
      req.body.object.verified = true;
    }
    AdminServices.update({ _id: req.body.query.member_id }, req.body.object)
      .then(data => {
        return res.status(200).send({ success: true });
      })
      .catch(err => {
        return res
          .status(400)
          .send({ error: response.error.user_update_failed });
      });
  }
);

router.post(
  `/admin/${routes.GET_USER}`,
  AdminMiddlewares.get,
  authorize.Authorize,
  (req, res) => {
    //   {
    //     query:{
    //         _id OR phone OR key OR fb_id OR email
    //     }
    //  }
    console.log(req.body.query);
    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    AdminServices.get(req.body.query, { select: "-password" })
      .then(data => {
        if (!data) {
          return res.status(400).send({ error: response.error.user_not_found });
        }
        return res.status(200).send(data);
      })
      .catch(err => {
        //    console.log(err);
        return res.status(400).send({ error: response.error.user_not_found });
      });
  }
);
router.post(
  `/admin/${routes.DELETE_USER}`,
  AdminMiddlewares.delete,
  authorize.Authorize,
  (req, res) => {
    // {
    //     query:{
    //         admin
    //         member_id

    //     }
    // }
    console.log(req.body.query);
    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    AdminServices.get(
      { _id: req.body.query.member_id, role: { $gt: configs.roles.admin } },
      { select: "restos role" }
    )
      .then(data => {
        if (!data) {
          return res
            .status(401)
            .send({ error: response.error.no_such_user_or_permision_denied });
        }
        AdminServices.get(
          { _id: req.body.query.admin, role: { $lt: data.role } },
          { select: "role" }
        )
          .then(doer => {
            if (!doer) {
              return res.status(401).send({ error: response.permision_denied });
            }
            RestoService.genericUpdateMany(
              {
                _id: [...data.restos],
                admins: req.body.query.member_id
              },
              { admins: req.body.query.member_id }
            )
              .then(data => {
                AdminServices.delete({ _id: req.body.query.member_id })
                  .then(data => {})
                  .catch(err => {
                    console.log(err);
                  });
                return res.status(200).send({ success: true });
              })
              .catch(err => {
                console.log(err);
                return res
                  .status(400)
                  .send({ error: process.error.failed_process });
              });
          })
          .catch(err => {
            console.log(err);
            return res
              .status(400)
              .send({ error: response.error.no_such_user_or_permision_denied });
          });
      })
      .catch(err => {
        console.log(err);
        return res
          .status(401)
          .send({ error: response.error.no_such_user_or_permision_denied });
      });
  }
);

router.post(
  `/admin/resto/${routes.GET_RESTOS}`,
  AdminMiddlewares.getRestos,
  authorize.Authorize,
  (req, res) => {
    // {
    //     query:{
    //         admin
    //     }
    // }
    console.log(req.body.query);
    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    AdminServices.get({
      _id: req.body.query.admin,
      role: { $lte: configs.roles.manager }
    })
      .then(data => {
        if (!data) {
          return res
            .status(401)
            .send({ error: response.error.permision_denied });
        }
        AdminServices.get(
          { _id: req.body.query.admin },
          { populate: "restos", select: "restos" }
        )
          .then(data => {
            if (!data) {
              return res.status(400).send({ error: response.error.no_data });
            }
            return res.status(200).send(data);
          })
          .catch(err => {
            // console.log(err);
            return res
              .status(400)
              .send({ error: response.error.failed_process });
          });
      })
      .catch(err => {
        console.log(err);
        return res.status(400).send({ error: response.error.failed_process });
      });
  }
);

router.put(
  `/admin/resto/${routes.ADD_MEMBER_TO_RESTO}`,
  AdminMiddlewares.addMemberToResto,
  authorize.Authorize,
  (req, res) => {
    // {
    //     query:{
    //         admin
    //         resto_id
    //     }
    //     object:{
    //         phone
    //         name,
    //         role,
    //         email
    //     }
    // }
    console.log(req.body);

    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    let query = {
      _id: req.body.query.admin,
      restos: { $in: [req.body.query.resto_id] }
    };

    AdminServices.get(query, { populate: "restos", select: "restos role" })
      .then(data => {
        if (!data) {
          return res.status(400).send({ error: response.error.no_data });
        }
        if (data.role <= req.body.object.role) {
          AdminServices.create(req.body.object, {
            pushKey: "restos",
            pushValue: req.body.query.resto_id
          })
            .then(member => {
              if (member) {
                RestoService.pushUpdate(
                  { _id: req.body.query.resto_id },
                  { admins: member._id }
                )
                  .then(data => {
                    return res.status(200).send({ success: true });
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            })
            .catch(err => {
              // console.log(err);
              return res
                .status(400)
                .send({ error: response.error.failed_process });
            });
        } else {
          return res.status(401).send({
            error: response.error.you_cant_add_member_role_grater_than_you
          });
        }
      })
      .catch(err => {
        // console.log(err);
        return res.status(400).send({ error: response.error.failed_process });
      });
  }
);

router.post(`/admin/${routes.CHECK_LOGIN}`, (req, res) => {
  authorize.isLogin(req, res);
});

router.post(
  `/admin/${routes.CHANGE_STATUS}`,
  authorize.Authorize,
  async (req, res) => {
    // {
    //   query: {
    //     member_id: string
    //   }
    //   object: {
    //     status: boolean
    //   }
    // }
    try {
      await AdminServices.update(
        { _id: req.body.query.member_id },
        { active: req.body.object.status }
      );
      return res.status(200).send({ active: req.body.object.status });
    } catch (e) {
      return res.status(400).send({ error: response.error.failed_process });
    }
  }
);
module.exports = router;
