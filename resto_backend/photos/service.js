const fs = require("fs");
const request = require("request");
const probe = require("probe-image-size");

const PhotoDAO = require("./models/dao");
const Errors = require("./../init/errors");

class PhotoService {
  constructor() {}

  uploadPhoto(file, options) {
    return new Promise((resolve, reject) => {
      options = options || {};
      // Temporary check
      if (!file || !file.buffer) {
        return reject(Errors.FILE_NOT_PROVIDED);
      }
      let image = probe.sync(file.buffer);
      if (!image) {
        return reject(Errors.THIRD_PARTY_ERROR);
      }
      PhotoDAO.insert({
        image: file.buffer,
        content_type: image.type,
        mime: image.mime,
        width: image.width,
        height: image.height,
        size: file.size,
        user_id: options.user_id || undefined,
        entity_id: options.entity_id || undefined
      })
        .then(photo => {
          photo.id = photo._id;
          delete photo._id;
          return resolve(photo);
        })
        .catch(err => {
          console.log(err);
          return reject(Errors.UPLOAD_ERROR);
        });
    });
  }

  savePhoto(photo, options) {
    return new Promise((resolve, reject) => {
      if (!photo) return reject(Errors.FILE_NOT_PROVIDED);
      let image = probe.sync(photo);
      if (!image) return reject(Errors.THIRD_PARTY_ERROR);
      PhotoDAO.insert({
        image: photo,
        content_type: image.type,
        mime: image.mime,
        width: image.width,
        height: image.height,
        size: file.size
      })
        .then(photo => {
          photo.id = photo._id;
          delete photo._id;
          return resolve(photo);
        })
        .catch(err => {
          console.log(err);
          return reject(Errors.UPLOAD_ERROR);
        });
    });
  }

  importFromUrl(url, options) {
    return new Promise((resolve, reject) => {
      var tmp_path = __dirname + "/contents/qr-" + Date.now();
      request.head(url, function(err, res, body) {
        if (
          !res.headers["content-type"] ||
          res.headers["content-type"].indexOf("image/") == -1
        ) {
          return reject(Errors.UPLOAD_ERROR);
        }
        request(url)
          .pipe(fs.createWriteStream(tmp_path))
          .on("close", function() {
            let buffer = fs.readFileSync(tmp_path);
            let image = probe.sync(buffer);
            if (!image) {
              fs.unlink(tmp_path, err => console.log(err));
              return reject(Errors.THIRD_PARTY_ERROR);
            }
            PhotoDAO.insert({
              image: buffer,
              content_type: image.type,
              mime: image.mime,
              width: image.width,
              height: image.height,
              table: options.table_id
            })
              .then(photo => {
                photo.id = photo._id;
                delete photo._id;
                fs.unlink(tmp_path, err => console.log(err));
                return resolve(photo);
              })
              .catch(err => {
                console.log("uploadPhoto err = ", err);
                fs.unlink(tmp_path, err => console.log(err));
                return reject(Errors.UPLOAD_ERROR);
              });
          });
      });
    });
  }

  getPhotoById(id) {
    return PhotoDAO.fetchOne({ _id: id });
  }
  delete(query) {
    return new Promise((resolve, reject) => {
      PhotoDAO.remove(query)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  removeMany(query) {
    return new Promise((resolve, reject) => {
      PhotoDAO.removeMany(query)
        .then(data => {
          return resolve(data);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
  getDefaultPhoto(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, function(err, content) {
        if (!err) {
          return resolve(content);
        } else {
          return reject();
        }
      });
    });
  }
}

module.exports = new PhotoService();
