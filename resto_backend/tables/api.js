const router = require("express").Router();
const routes = require("./routes");
const TableServices = require("./service");
const PhotoService = require("../photos/service");
const RestoService = require("../restos/service");
const AdminService = require("../admins/service");
const configs = require("../admins/configs");
const TableMiddleware = require("./middlewares/index");
const authorize = require("../authorization");
const response = require("../init/response");

router.post(
  `/admin/table/${routes.CREATE_TABLE}`,
  TableMiddleware.create,
  authorize.Authorize,
  async (req, res) => {
    // {
    //     query:{
    //         admin
    //     }
    //     object:{
    //          No
    //         chairs
    //         resto
    //     }
    // }
    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    try {
      const admin = await AdminService.get({
        _id: req.body.query.admin,
        role: { $lte: configs.roles.manager }
      });
      if (!admin) {
        return res.status(401).send({ error: response.error.permision_denied });
      }
      let tablesCount = await TableServices.getTablesCount({
        resto: req.body.object.resto
      });
      req.body.object.No = parseInt(++tablesCount, 10);
      const table = await TableServices.create(req.body.object);
      if (!table) {
        return res.status(400).send({ error: response.error.failed_process });
      }
      await RestoService.pushUpdate(
        { _id: req.body.object.resto },
        { tables: table._id }
      );
      const qr = await TableServices.getQR(table._id, {
        resolved_query: req.resolved_query,
        No: req.body.object.No
      });
      if (!qr) {
        return res.status(400).send({ error: response.error.failed_process });
      }
      const photo = await PhotoService.getPhotoById(qr);
      if (!photo) {
        return res.status(400).send({ error: response.error.failed_process });
      }
      res.contentType(photo.content_type);
      res.setHeader("Cache-Control", "public, max-age=31557600");
      return res.send(photo.image);
    } catch (e) {
      console.log(err);
      return res.status(400).send({ error: response.error.failed_process });
    }
  }
);

router.get(`/admin/table/${routes.GET_TABLES_COUNT}`, async (req, res) => {
  try {
    console.log(req.query, req.param, req.params);
    let tablesCount = await TableServices.getTablesCount({
      resto: req.query.resto
    });
    return res.status(200).send({ tablesCount });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: response.error.failed_process });
  }
});

router.post(`/admin/table/${routes.UPDATE_TABLE}`, async (req, res) => {});

router.post(
  `/admin/table/${routes.GET_TABLES}`,
  TableMiddleware.getMany,
  authorize.Authorize,
  (req, res) => {
    // {
    //     query:{
    //         admin
    //         resto
    //     }
    // }
    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    AdminService.get({
      _id: req.body.query.admin,
      role: { $lte: configs.roles.manager }
    })
      .then(data => {
        if (!data) {
          return res
            .status(401)
            .send({ error: response.error.permision_denied });
        }
        TableServices.getMany({ resto: req.body.resto })
          .then(data => {
            if (!data) {
              return res.status(400).send({ error: response.error.no_data });
            }
            return res.status(200).send(data);
          })
          .catch(err => {
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

router.post(
  `/admin/table/${routes.DELETE_TABLE}`,
  TableMiddleware.delete,
  authorize.Authorize,
  (req, res) => {
    // {
    //     query:{
    //         admin
    //         table_id
    //          resto_id
    //     }
    // }

    AdminService.get({
      _id: req.body.query.admin,
      role: { $lte: configs.roles.manager }
    })
      .then(data => {
        if (!data) {
          return res
            .status(401)
            .send({ error: response.error.permision_denied });
        }
        RestoService.get(
          { _id: req.body.query.resto_id },
          { select: { tables: { $slice: -1 } } }
        )
          .then(lastTable => {
            lastTable = lastTable.tables[0];

            if (lastTable) {
              // {tables: req.body.query.table_id}
              RestoService.justUpdate(
                {
                  _id: req.body.query.resto_id
                  // tables: req.body.query.table_id
                },
                { $pop: { tables: 1 } }
              )
                .then(data => {
                  TableServices.delete({ _id: lastTable._id })
                    .then(data => {
                      PhotoService.delete({ table: lastTable._id })
                        .then(data => {
                          res.status(200).send({ success: true });
                        })
                        .catch(err => {
                          console.log(err);
                        });
                    })
                    .catch(err => {
                      console.log(err);
                    });
                })
                .catch(err => {
                  console.log(err);
                  return res
                    .status(400)
                    .send({ error: response.error.failed_process });
                });
            }
          })
          .catch(err => {});
      })
      .catch(err => {
        console.log(err);
        return res.status(400).send({ error: response.error.failed_process });
      });
  }
);

router.post(`/${routes.GET_QR}`, async (req, res) => {
  // {
  //     id //table_id
  // }
  TableServices.getQR(req.body.id, req.resolved_query)
    .then(qr => {
      return PhotoService.getPhotoById(qr);
    })
    .then(photo => {
      res.contentType(photo.content_type);
      res.setHeader("Cache-Control", "public, max-age=31557600");
      res.send(photo.image);
    })
    .catch(err => {
      res.status(400).send({ error: response.error.failed_process });
    });
});

module.exports = router;
