const router = require("express").Router();
const routes = require("./routes");
const PhotoService = require("./service");
const fs = require("fs");
const response = require("../init/response");
const mime = require("mime-types");

router.get(`/${routes.GET_DEFAULT_PHOTO}`, (req, res) => {
  let path = `${process.env.DEFAULT_PHOTO_PATH}`;
 
  PhotoService.getDefaultPhoto(path).then(data=>{
    let Ftype = mime.lookup(path);
    res.contentType(Ftype);
    res.setHeader("Cache-Control", "public, max-age=31557600");
    return res.status(200).send(data);
  }).catch(err=>{
      return res.status(400).send({ error: response.error.no_data });
  })
  // OR This if there is default photo in db and photo id is known=>

  // PhotoService.getPhotoById({ _id: process.env.DEFAULT_PHOTO }).then(photo => {
  //   res.contentType(photo.content_type);
  //   res.setHeader("Cache-Control", "public, max-age=31557600");
  //   return res.status(200).send(photo.image);
  // });
});

module.exports = router;
