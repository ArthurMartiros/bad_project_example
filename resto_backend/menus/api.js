const router = require("express").Router();
const fs = require("fs");
const multer = require("multer");
const _ = require("underscore");
const routes = require("./routes");
const MenuServices = require("./service");
const RestoService = require("../restos/service");
const TableServices = require("../tables/service");
const errors = require("../init/errors");
const authorize = require("../authorization");
const PhotoService = require("../photos/service");
const probe = require("probe-image-size");
const response = require("../init/response");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.fieldname == "category") {
      cb(null, __dirname + "/contents/category");
    } else if (file.fieldname == "item") {
      cb(null, __dirname + "/contents/item");
    }
    // console.log("File: ",file);
    // console.log("Rfs: ",req.files);
    // console.log("Rf: ",req.file);
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});
Array.prototype.diff = function(a) {
  return this.filter(x => !a.includes(x));
  // return this.filter(function(i) {
  //   return a.indexOf(i) < 0;
  // });
};
function difference(a1, a2) {
  var result = [];
  for (var i = 0; i < a1.length; ++i) {
    if (a2.indexOf(a1[i]) == -1) {
      result.push(a1[i]);
      a1.splice(i, 1);
    }
  }
  return result;
}
var upload = multer();
router.post(
  `/admin/menu/${routes.CREATE_MENU}`,
  authorize.Authorize,
  (req, res) => {
    console.log(req.body);
    let object = {
      categories: [
        // {
        //     name:null,
        //     photo: null,
        //     items:[
        //         {
        //             name:null,
        //             price: null,
        //             description: null,
        //             photo: null
        //         }
        //     ]
        // }
      ],
      resto: req.body.query.resto_id,
      currency_simbol: req.body.object.currency_simbol
    };

    MenuServices.create(object)
      .then(data => {
        if (data) {
          RestoService.update(
            { _id: req.body.query.resto_id },
            { menu: data._id }
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
  `/admin/menu/${routes.CREATE_CATEGORIES}`,
  upload.fields([
    { name: "categoryPhoto", maxCount: 1 },
    { name: "itemPhoto" }
  ]),
  authorize.Authorize,
  (req, res) => {
    // {
    //     req.filess

    //     query:{
    //         resto_id: String
    //
    //     }
    //     object:{
    //         category_name: String
    //         item_name:[]
    //         item_price:[]
    //         item_description:[]
    //     }
    // }

    console.log(req.body);
    delete req.body.query;
    delete req.body.token;

    // if(!JSON.parse(req.body.itemPhotoName[0])){
    //     return res.status(405).send('First Item  Must ')
    // }

    MenuServices.creatUpdateeCategory(
      { resto: req.body.resto_id },
      { body: req.body, files: req.files },
      true
    )
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        console.log(err);
        return res.status(400).send({ error: response.error.failed_process });
      });
  }
);
router.post(
  `/admin/menu/${routes.UBDATE_CATEGORIES}`,
  upload.fields([
    { name: "categoryPhoto", maxCount: 1 },
    { name: "itemPhoto" }
  ]),
  authorize.Authorize,
  (req, res) => {
    // {
    // req.files

    //     query:{
    //         resto_id: String
    //         category_id: String
    //     }
    //     object:{
    //         category_name: String
    //         item_name:[]
    //         item_price:[]
    //         item_description:[]
    //     }
    // }

    console.log(req.body);
    MenuServices.get(
      {
        resto: req.body.resto_id,
        "categories._id": req.body.catId
      },
      { select: "categories.$" }
    )
      .then(async m => {
        m.categories[0].name = req.body.categoryName;

        if (req.files.categoryPhoto) {
          if (m.categories[0].photo) {
            PhotoService.delete({ _id: m.categories[0].photo })
              .then(() => {})
              .catch(err => {
                console.log(err);
              });
          }

          let photo = await PhotoService.uploadPhoto(
            req.files.categoryPhoto[0]
          );
          m.categories[0].photo = photo.id;
        }
        let items = m.categories[0].items;
        if (Array.isArray(req.body.name)) {
          if (!req.body.itemId) {
            let removablePhotos = [];
            for (let x = 0; x < items.length; ++x) {
              if (items[x].photo) {
                removablePhotos.push(items[x].photo);
              }
              items.splice(x, 1);
            }
            for (let x = 0; x < req.body.name.length; ++x) {
              let obj = {
                name: req.body.name[x],
                price: req.body.price[x],
                description: req.body.desc[x],
                photo: null
              };
              if (req.body.itemPhotoName[x] != "null") {
                let file = req.files.itemPhoto.find(function(el) {
                  return el.originalname == req.body.itemPhotoName[x];
                });
                if (file) {
                  let photo = await PhotoService.uploadPhoto(file);
                  if (photo) {
                    obj.photo = photo.id;
                  }
                }
              }
              items.push(obj);
            }

            if (removablePhotos.length > 0) {
              PhotoService.removeMany({ _id: removablePhotos })
                .then(() => {})
                .catch(err => {
                  console.log(err);
                });
            }
          } else {
            let itemIds = [];

            for (let y = 0; y < items.length; ++y) {
              itemIds.push(items[y]._id);
            }
            let diff = [];
            itemIds = itemIds.map(item => item.toString());

            if (Array.isArray(req.body.itemId)) {
              diff = _.difference(itemIds, req.body.itemId);
            } else {
              if (!itemIds.includes(req.body.itemId) && req.body.itemId != "") {
                diff.push(req.body.itemId);
              }
            }

            if (diff.length > 0) {
              let removablePhotos = [];
              for (let i = 0; i < diff.length; ++i) {
                let removableIndex = itemIds.indexOf(diff[i]);
                if (items[removableIndex] && items[removableIndex].photo) {
                  removablePhotos.push(items[removableIndex].photo);
                }
                if (removableIndex >= 0) {
                  itemIds.splice(removableIndex, 1);
                  items.splice(removableIndex, 1);
                }
              }
              if (removablePhotos.length > 0) {
                await PhotoService.removeMany({ _id: removablePhotos });
              }
            }

            for (let x = 0; x < req.body.name.length; ++x) {
              if (x > items.length - 1) {
                let obj = {
                  name: req.body.name[x],
                  price: req.body.price[x],
                  description: req.body.desc[x],
                  photo: null
                };
                if (req.body.itemPhotoName[x] != "null") {
                  let file = req.files.itemPhoto.find(function(el) {
                    return el.originalname == req.body.itemPhotoName[x];
                  });
                  if (file) {
                    let photo = await PhotoService.uploadPhoto(file);
                    if (photo) {
                      obj.photo = photo.id;
                    }
                  }
                }
                items.push(obj);
              } else {
                items[x].name = req.body.name[x];
                items[x].price = req.body.price[x];
                items[x].description = req.body.desc[x];
                let removablePhotos = [];
                if (req.body.itemPhotoName[x] != "null") {
                  let file = req.files.itemPhoto.find(function(el) {
                    return el.originalname == req.body.itemPhotoName[x];
                  });
                  if (file) {
                    let photo = await PhotoService.uploadPhoto(file);
                    if (photo) {
                      if (items[x].photo) {
                        removablePhotos.push(items[x].photo);
                      }
                      items[x].photo = photo.id;
                    }
                  }
                }
                if (removablePhotos.length > 0) {
                  PhotoService.removeMany({ _id: removablePhotos })
                    .then(() => {})
                    .catch(err => {
                      console.log(err);
                    });
                }
              }
            }
          }
        } else {
          if (!req.body.itemId) {
            if (items.length > 0) {
              let removablePhotos = [];
              for (let x = 0; x < items.length; ++x) {
                if (items[x].photo) {
                  removablePhotos.push(items[x].photo);
                }
              }
              if (removablePhotos.length > 1) {
                PhotoService.removeMany({ _id: removablePhotos })
                  .then(() => {})
                  .catch(err => {});
              } else {
                PhotoService.delete({ _id: removablePhotos[0] })
                  .then(() => {})
                  .catch(err => {});
              }

              items = [];
            }

            // let obj = {
            //   name: req.body.name,
            //   price: req.body.price,
            //   description: req.body.desc,
            //   photo: null
            // };
            // if (req.body.itemPhotoName != "null") {
            //   let file = req.files.itemPhoto[0];
            //   if (file) {
            //     let photot = await PhotoService.uploadPhoto(file);
            //     obj.photo = photot.id;
            //   }
            // }
            // items.push(obj);
          } else {
            let itemIds = [];

            for (let y = 0; y < items.length; ++y) {
              itemIds.push(items[y]._id);
            }
            let diff = [];
            itemIds = itemIds.map(item => item.toString());
            diff = _.difference(itemIds, [req.body.itemId]);

            if (diff.length > 0) {
              let removablePhotos = [];
              for (let i = 0; i < diff.length; ++i) {
                let removableIndex = itemIds.indexOf(diff[i]);
                if (items[removableIndex] && items[removableIndex].photo) {
                  removablePhotos.push(items[removableIndex].photo);
                }
                if (removableIndex >= 0) {
                  itemIds.splice(removableIndex, 1);
                  items.splice(removableIndex, 1);
                }
              }
              if (removablePhotos.length > 0) {
                await PhotoService.removeMany({ _id: removablePhotos });
              }
            }
            items[0].name = req.body.name;
            items[0].price = req.body.price;
            items[0].description = req.body.desc;
            if (req.body.itemPhotoName != "null") {
              let file = req.files.itemPhoto[0];
              let photoItem;
              if (file) {
                photoItem = await PhotoService.uploadPhoto(file);
              }
              if (photoItem) {
                if (items[0].photo) {
                  await PhotoService.delete({ _id: items[0].photo });
                }
                items[0].photo = photoItem.id;
              }
            }
          }
        }
        MenuServices.update(
          {
            resto: req.body.resto_id,
            "categories._id": req.body.catId
          },
          {
            "categories.$.name": m.categories[0].name,
            "categories.$.photo": m.categories[0].photo,
            "categories.$.items": items
          }
        )
          .then(data => {
            return res.status(200).send({ success: true });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        return res.status(400).send({ error: "No Data" });
      });

    // MenuServices.creatUpdateeCategory({
    //     resto: req.body.resto_id,
    //     'categories._id':req.body.category_id
    // },{body:req.body, files: req.files}).then(data=>{
    //     return res.status(200).send(data);
    // }).catch(err=>{
    //     console.log(err);
    //     res.status(400).send({error: response.error.failed_process});
    // })
  }
);
router.post(
  `/admin/menu/${routes.DELETE_CATEGORIES}`,
  authorize.Authorize,
  (req, res) => {
    // {
    //     query:{
    //         resto_id
    //         category_id
    //     }
    // }

    console.log(req.body.query);
    MenuServices.deleteCategory(
      {
        resto: req.body.query.resto_id,
        "categories._id": req.body.query.category_id
      },
      { categories: { _id: req.body.query.category_id } }
    )
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        console.log(err);
        return res.status(400).send({ error: response.error.failed_process });
      });
  }
);

router.post(`/menu/${routes.GET_MENU}`, (req, res) => {
  // {
  //     query:{
  //         table_id
  //     }
  // }
  console.log(req.body.query);
  TableServices.get(
    { _id: req.body.query.table_id }
    // {
    //   populate: {
    //     path: "resto",
    //     match: { disable: false },
    //     select: "_id name photo"
    //   }
    //   // select: "resto name"
    // }
  ).then(r => {
    if (r) {
      MenuServices.get(
        { resto: r.resto},
        {
          populate: {
            path: "resto",
            match: { disable: false },
            select: "_id name photo"
          }
        }
      ).then(m => {
        return res
          .status(200)
          .send(Object.assign({ manu: m }, { tableNo: r.No }));
      });
    } else {
      return res.status(400).send({ error: response.error.no_data });
    }
  });
});
router.post(
  `/admin/menu/${routes.GET_MENU_SIMPLY}`,
  authorize.Authorize,
  (req, res) => {
    // {
    //     query:{
    //         resto
    //         catId
    //     }
    // }
    console.log(req.body);
    if (req.body.query.catId) {
      MenuServices.get(
        {
          resto: req.body.query.resto,
          "categories._id": req.body.query.catId
        },
        { select: "currency_simbol categories.$" }
      )
        .then(m => {
          return res.status(200).send({
            categories: m.categories[0],
            currency_simbol: m.currency_simbol
          });
        })
        .catch(err => {
          return res.status(400).send({ error: "No Data" });
        });
    } else {
      MenuServices.get(
        { resto: req.body.query.resto },
        {
          select:
            "categories._id categories.name categories.photo resto currency_simbol"
        }
      )
        .then(m => {
          return res.status(200).send(m);
        })
        .catch(err => {
          return res.status(400).send({ error: "No Data" });
        });
    }
  }
);
router.get(`/menu/${routes.GET_PHOTO}/:id`, (req, res) => {
  console.log(req.params.id);
  if (req.params.id) {
    PhotoService.getPhotoById(req.params.id)
      .then(photo => {
        res.contentType(photo.content_type);
        res.setHeader("Cache-Control", "public, max-age=31557600");
        return res.send(photo.image);
      })
      .catch(err => {
        // console.log(err);
        return res.send({ error: response.error.no_data });
      });
  }
});
module.exports = router;
