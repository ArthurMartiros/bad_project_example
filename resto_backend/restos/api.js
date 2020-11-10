const router = require("express").Router();
const routes = require("./routes");
const RestoServices = require("./service");
const MenuService = require("../menus/service");
const TableService = require("../tables/service");
const errors = require("../init/errors");
const authorize = require("../authorization");
const RestoMiddlewares = require("./middlewares");
const AdminServices = require("../admins/service");
const PhotoService = require("../photos/service");
const configs = require("../admins/configs");
const response = require("../init/response");
const multer = require("multer");
const mime = require("mime-types");

var upload = multer();
router.post(
  `/admin/resto/${routes.CREATE_RESTO}`,
  // RestoMiddlewares.create,
  upload.fields([{ name: "logo", maxCount: 1 }]),
  authorize.Authorize,

  (req, res) => {
    // {
    //     query:{
    //         admin // admin_id
    //     }
    //     object:{
    //          name
    //          email: []
    //          phone: []
    //     }
    // }

    req.body.query = JSON.parse(req.body.query);
    req.body.object = JSON.parse(req.body.object);
    console.log(req.body);
    console.log(req.files);

    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    AdminServices.get({ _id: req.body.query.admin, role: configs.roles.admin })
      .then(data => {
        if (!data) {
          return res
            .status(401)
            .send({ error: response.error.permision_denied });
        }
        if (req.files && req.files.logo && req.files.logo[0]) {
          PhotoService.uploadPhoto(req.files.logo[0])
            .then(photo => {
              req.body.object.photo = photo.id;
              RestoServices.create(req.body.object, {
                pushKey: "admins",
                pushValue: req.body.query.admin
              })
                .then(data => {
                  if (!data) {
                    return res
                      .status(400)
                      .send({ error: response.error.failed_process });
                  }
                  AdminServices.pushUpdate(
                    { _id: req.body.query.admin },
                    { restos: data._id }
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
                })
                .catch(err => {
                  console.log(err);
                  return res
                    .status(400)
                    .send({ error: response.error.resto_create_failed });
                });
            })
            .catch(err => {
              return res
                .status(400)
                .send({ error: response.error.resto_create_failed });
            });
        } else {
          RestoServices.create(req.body.object, {
            pushKey: "admins",
            pushValue: req.body.query.admin
          })
            .then(data => {
              if (!data) {
                return res
                  .status(400)
                  .send({ error: response.error.failed_process });
              }
              AdminServices.pushUpdate(
                { _id: req.body.query.admin },
                { restos: data._id }
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
            })
            .catch(err => {
              console.log(err);
              return res
                .status(400)
                .send({ error: response.error.resto_create_failed });
            });
        }
      })
      .catch(err => {
        console.log(err);
        return res
          .status(400)
          .send({ error: response.error.no_such_user_or_permision_denied });
      });
  }
);
router.put(
  `/admin/resto/${routes.UPDATE_RESTO}`,
  // RestoMiddlewares.update,
  upload.fields([{ name: "logo", maxCount: 1 }]),

  authorize.Authorize,
  (req, res) => {
    // {
    //     query:{
    //         resto_id
    //         admin
    //     }
    //     object:{
    //         name
    //         email
    //         phone
    //     }
    // }
    req.body.query = JSON.parse(req.body.query);
    req.body.object = JSON.parse(req.body.object);
    console.log(req.body);

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
        if (req.files && req.files.logo && req.files.logo[0]) {
          PhotoService.uploadPhoto(req.files.logo[0])
            .then(photo => {
              RestoServices.get({ _id: req.body.query.resto_id })
                .then(resto => {
                  if (resto.photo) {
                    PhotoService.delete({ _id: resto.photo });
                  }
                })
                .catch(err => {});
              RestoServices.update(
                { _id: req.body.query.resto_id },
                {
                  email: req.body.object.email,
                  phone: req.body.object.phone,
                  name: req.body.object.name,
                  photo: photo.id
                }
              )
                .then(data => {
                  return res.status(200).send({ success: true });
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
              return res
                .status(400)
                .send({ error: response.error.failed_process });
            });
        } else {
          RestoServices.update(
            { _id: req.body.query.resto_id },
            {
              email: req.body.object.email,
              phone: req.body.object.phone,
              name: req.body.object.name
            }
          )
            .then(data => {
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
router.post(
  `/resto/${routes.GET_RESTO}`,
  RestoMiddlewares.get,
  authorize.Authorize,
  (req, res) => {
    // {
    //     query:{
    //         admin
    //         resto_id
    //     }
    // }

    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    AdminServices.get({
      _id: req.body.query.admin,
      role: { $lte: configs.roles.manager }
    })
      .then(data => {
        if (!data) {
          return res.status(401).send({ error: "permision_denied" });
        }
        // {populate: 'menu', select: 'menu'}
        RestoServices.get(
          { _id: req.body.query.resto_id },
          { populate: "tables admins" }
        )
          .then(data => {
            // console.log(data)
            if (!data) {
              return res.status(400).send({ error: response.error.no_data });
            }
            return res.status(200).send(data);
          })
          .catch(err => {
            console.log(err);
            return res.status(400).send({ error: response.error.no_data });
          });
      })
      .catch(err => {
        console.log(err);
        return res.status(400).send({ error: response.error.failed_process });
      });
  }
);
router.delete(
  `/admin/resto/${routes.DELETE_RESTO}`,
  RestoMiddlewares.delete,
  authorize.Authorize,
  (req, res) => {
    // {
    //     query:{
    //         admin
    //         resto_id //resto_id
    //     },
    // }

    //     data = await RestoServices.get(query,{select: 'tables admins'});
    //     console.log(data);
    //   await RestoServices.delete(req.body.query);
    //   await MenuService.delete({resto: req.body.query._id});
    //   await TableService.removeMany({resto: req.body.query._id});
    //   await PhotoService.removeMany({table:{$in:{ ...data.tables}}});
    //   await AdminServices.genericUpdate({
    //     restos: req.query._id
    //   },{restos: req.query._id});

    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    AdminServices.get({ _id: req.body.query.admin, role: configs.roles.admin })
      .then(data => {
        if (!data) {
          return res
            .status(401)
            .send({ error: response.error.permision_denied });
        }
        RestoServices.update(
          { _id: req.body.query.resto_id },
          { disable: true }
        )
          .then(data => {
            return res.status(200).send({ success: true });
          })
          .catch(err => {
            console.log(err);
            return res
              .status(400)
              .send({ error: response.error.failed_update });
          });
      })
      .catch(err => {
        console.log(err);
        return res.status(400).send({ error: response.error.failed_process });
      });
  }
);

router.post(
  `/admin/resto/${routes.GET_MEMBERS}`,
  authorize.Authorize,
  (req, res) => {
    // {
    //     query:{
    //         resto_id
    //         admin
    //     }
    // }
    let query = {
      _id: req.body.query.resto_id,
      admins: { $in: [req.body.query.admin] }
    };
    RestoServices.get(query, {
      populate: {
        path: "admins",
        select: "-password",
        populate: { path: "restos", select: "name disable" }
      },
      select: "admins"
    })
      .then(data => {
        // console.log(data)
        if (!data) {
          return res.status(400).send({ error: response.error.no_data });
        }
        return res.status(200).send(data);
      })
      .catch(err => {
        console.log(err);
        return res.status(400).send({ error: response.error.no_data });
      });
  }
);
router.get(`/${routes.GET_RESTO_LOGO}`, (req, res) => {
  console.log(req.query);
  RestoServices.getRestoLogo({ _id: req.query.resto }, { select: "photo" })
    .then(data => {
      console.log(data);
      if (data.photo) {
        PhotoService.getPhotoById({ _id: data.photo }).then(photo => {
          res.contentType(photo.content_type);
          res.setHeader("Cache-Control", "public, max-age=31557600");
          return res.status(200).send(photo.image);
        });
      } else {
        let path = `${process.env.DEFAULT_PHOTO_PATH}`;

        PhotoService.getDefaultPhoto(path)
          .then(defPhoto => {
            let Ftype = mime.lookup(path);
            res.contentType(Ftype);
            res.setHeader("Cache-Control", "public, max-age=31557600");
            return res.status(200).send(defPhoto);
          })
          .catch(err => {
            return res.status(400).send({ error: response.error.no_data });
          });
      }
    })
    .catch(err => {
      // console.log(err);
      return res.status(400).send({ error: response.error.no_data });
    });
});
router.get(`/${routes.GET_RESTO_LOGO_BY_TABLE}`, (req, res) => {
  console.log(req.query);
  TableService.get(
    { _id: req.query.table_id },
    {
      populate: {
        path: "resto",
        match: { disable: false },
        select: "photo"
      },
      select: "resto"
    }
  )
    .then(data => {
      if (data.resto.photo) {
        PhotoService.getPhotoById({ _id: data.resto.photo }).then(photo => {
          res.contentType(photo.content_type);
          res.setHeader("Cache-Control", "public, max-age=31557600");
          return res.status(200).send(photo.image);
        });
      } else {
        let path = `${process.env.DEFAULT_PHOTO_PATH}`;

        PhotoService.getDefaultPhoto(path)
          .then(defPhoto => {
            let Ftype = mime.lookup(path);
            res.contentType(Ftype);
            res.setHeader("Cache-Control", "public, max-age=31557600");
            return res.status(200).send(defPhoto);
          })
          .catch(err => {
            return res.status(400).send({ error: response.error.no_data });
          });
      }
    })
    .catch(err => {
      return res.status(400).send({ error: response.error.no_data });
    });
});

module.exports = router;
