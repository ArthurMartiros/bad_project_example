const Schema = require("mongoose").Schema;
const userSettings = require("../../settings/app_settings").users;
const Validator = require("validator");
const configs = require("../configs");

let MenuModel = new Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 20
  },
  resto: {
    type: Schema.Types.ObjectId,
    ref: "restos"
  },
  currency_simbol: {
    type: String
  },
  categories: [
    {
      name: {
        type: String,
        minlength: 1,
        maxlength: 20
      },
      photo: {
        type: Schema.Types.ObjectId,
        ref: "photos",
        index: true,
        default: null
      },

      items: [
        {
          name: {
            type: String,
            minlength: 1,
            maxlength: 20
          },
          price: {
            type: Number
          },
          description: {
            type: String
          },
          photo: {
            type: Schema.Types.ObjectId,
            ref: "photos",
            index: true
          }
        }
      ]
    }
  ]
});
module.exports = MenuModel;
