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
const AdminModel = new Schema({
  name: {
    type: String,
    trim: true,
    minlength: userSettings.name_min_length,
    maxlength: userSettings.name_max_length
  },
  // last_name:{
  //     type:String,
  //     trim: true,
  //     minlength: userSettings.last_name_min_legth,
  //     maxlength: userSettings.last_name_max_length,
  // },
  // email: {
  //     type: String,
  //     trim: true,
  //     // index: { unique: true, sparse: true },
  //     lowercase: true,
  //     default: null,
  //     maxlength: userSettings.email_maxlength,
  //     validate: Validator.isEmail
  // },
  fb_id: {
    type: String,
    default: null,
    index: true
  },
  password: {
    type: String,
    default: null,
    minlength: userSettings.password_minlength,
    maxlength: userSettings.password_maxlength
  },
  role: {
    type: Number,
    // enum: AppConstants.user_role_values,
    default: configs.roles.admin
  },
  phone: {
    type: String,
    index: { unique: true, sparse: true },
    required: true,
    minlength: userSettings.phone_minlength,
    maxlength: userSettings.phone_maxlength
  },
  key: {
    type: String,
    default: generateAPIKey,
    index: { unique: true }
  },
  restos: [{ type: Schema.Types.ObjectId, ref: "restos", default: null }],
  verified: { type: Boolean, default: false },

  gender: String,
  birthdate: Date,
  device_type: String,
  push_notification_device_token: {
    type: String,
    default: null
  },
  email_confirmed: Boolean,
  phone_secret: String,
  phone_verified: Boolean,
  active: Boolean
});

module.exports = AdminModel;
