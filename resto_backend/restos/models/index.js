const Schema = require("mongoose").Schema;
const userSettings = require("../../settings/app_settings").users;
const Validator = require("validator");
const keygen = require("keygenerator");
const configs = require("../configs");

function generateAPIKey() {
  return (
    keygen._({ length: 2 }) +
    "-" +
    keygen._({ length: 6 }) +
    "-" +
    keygen.number() +
    "-" +
    keygen._({ length: 6 }) +
    "-" +
    keygen._({ length: 8 })
  ).replace(/&/g, "");
}
const RestoModel = new Schema({
  name: {
    type: String,
    trim: true,
    index: { unique: true },
    minlength: userSettings.name_min_length,
    maxlength: userSettings.name_max_length
  },

  email: [
    {
      type: String,
      trim: true,
      // index: { unique: true, sparse: true },
      // unique: true,
      lowercase: true,
      default: null,
      maxlength: userSettings.email_maxlength,
      validate: Validator.isEmail
    }
  ],

  phone: [
    {
      type: String,
      // index: {unique: true, sparse: true },
      // unique: true,
      // required: true,
      minlength: userSettings.phone_minlength,
      maxlength: userSettings.phone_maxlength
    }
  ],
  address: {
    type: String
    // required: true,
  },
  key: {
    type: String,
    default: generateAPIKey,
    index: { unique: true }
  },
  admins: [{ type: Schema.Types.ObjectId, ref: "admins" }],
  tables: [{ type: Schema.Types.ObjectId, ref: "tables" }],
  menu: { type: Schema.Types.ObjectId, ref: "menus" },
  photo: { type: Schema.Types.ObjectId, ref: "photos" },
  disable: { type: Boolean, default: false }
});

module.exports = RestoModel;
