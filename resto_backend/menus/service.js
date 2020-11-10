const MenuDAO = require("./models/dao");
const PhotoService = require("../photos/service");
const probe = require("probe-image-size");

class MenuService {
  constructor() {}

  create(objet, push = null) {
    return new Promise((resolve, reject) => {
      MenuDAO.insert(objet, push)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          console.log(err);
          return reject(err);
        });
    });
  }
  update(query, obj) {
    return new Promise((resolve, reject) => {
      MenuDAO.updateOne(query, obj)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  pushUpdate(query, obj) {
    return new Promise((resolve, reject) => {
      MenuDAO.pushUpdate(query, obj)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  get(query, options) {
    return new Promise((resolve, reject) => {
      MenuDAO.fetchOne(query, options)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  getMany(query, options) {
    return MenuDAO.fetchMany(query, options);
  }
  delete(query) {
    return MenuDAO.remove(query);
  }

  deletePhotos(query) {
    this.get(query)
      .then(async cat => {
        let spec = cat.categories.find(el => {
          return el._id == query["categories._id"];
        });

        let deltionPhotos = [];
        deltionPhotos.push(spec.photo);
        for (let x = 0; x < spec.items.length; ++x) {
          if (spec.items[x].photo) {
            deltionPhotos.push(spec.items[x].photo);
          }
        }
        console.log(deltionPhotos, "deletion Photos");
        if (deltionPhotos.length > 0) {
          PhotoService.removeMany({ _id: deltionPhotos })
            .then(data => {})
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  creatUpdateeCategory(query, obj, push = false) {
    let categories = {
      name: "",
      photo: null,
      items: []
    };

    return new Promise(async (resolve, reject) => {
      if (!obj.body.categoryName || obj.body.categoryName == "") {
        return reject({ error: "missing_category_name" });
      }

      categories.name = obj.body.categoryName;
      if (obj.files.categoryPhoto) {
        let photo = await PhotoService.uploadPhoto(obj.files.categoryPhoto[0]);
        if (!photo) {
          return reject({ error: "upload_failed_for_category" });
        }
        categories.photo = photo.id;
      } else {
        categories.photo = null;
      }

      if (push) {
        if (Array.isArray(obj.body.name)) {
          for (let i = 0; i < obj.body.itemPhotoName.length; ++i) {
            if (obj.body.itemPhotoName[i] != "null") {
              let uploadable = obj.files.itemPhoto.find(el => {
                return el.originalname == obj.body.itemPhotoName[i];
              });
              let photoItem = await PhotoService.uploadPhoto(uploadable);
              if (photoItem) {
                categories.items.push({
                  name: obj.body.name[i],
                  price: obj.body.price[i] == "" ? 0 : obj.body.price[i],
                  description: obj.body.desc[i],
                  photo: photoItem.id
                });
              } else {
                return reject({ error: "uploiad_failed_for_menu_items" });
              }
            } else {
              categories.items.push({
                name: obj.body.name[i],
                price: obj.body.price[i] == "" ? 0 : obj.body.price[i],
                description: obj.body.desc[i],
                photo: null
              });
            }
          }
        } else {
          if (obj.body.itemPhotoName && obj.body.itemPhotoName != "null") {
            let uploadable = obj.files.itemPhoto.find(el => {
              return el.originalname == obj.body.itemPhotoName;
            });
            let photoItem = await PhotoService.uploadPhoto(uploadable);
            if (photoItem) {
              categories.items.push({
                name: obj.body.name,
                price: obj.body.price == "" ? 0 : obj.body.price,
                description: obj.body.desc,
                photo: photoItem.id
              });
            } else {
              return reject({ error: "uploiad_failed_for_menu_items" });
            }
          } else {
            categories.items.push({
              name: obj.body.name,
              price: obj.body.price == "" ? 0 : obj.body.price,
              description: obj.body.desc,
              photo: null
            });
          }
        }

        this.pushUpdate(query, { categories: categories })
          .then(data => {
            return resolve(data);
          })
          .catch(err => {
            console.log(err);
            return reject({ error: "process_failed" });
          });
      } else {
        this.deletePhotos(query);
        this.update(query, {
          "categories.$.name": categories.name,
          "categories.$.photo": categories.photo
          // "categories.$.items":categories.items
        })
          .then(data => {
            return resolve(data);
          })
          .catch(err => {
            console.log(err);
            return reject({ error: "process_failed" });
          });
      }
    });
  }

  updatCategory(query, obj) {}

  deleteCategory(query, obj) {
    return new Promise((resolve, reject) => {
      this.deletePhotos(query);

      MenuDAO.genericUpdate(query, { $pull: obj })
        .then(() => {
          return resolve({ success: true });
        })
        .catch(err => {
          console.log(err);
          return reject({ error: "deletion_failed" });
        });
    });
  }
}

module.exports = new MenuService();
