const Schema = require("mongoose").Schema;

const UserModel = new Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 20
  },
  fb_id: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    minlength: 3,
    maxlength: 25,
    required: true,
    unique: true
  },
  device_token: {
    type: String,
    required: true
  },
  device_os: {
    type: String,
    required: true
  },
  order_history: [
    {
      resto: {
        type: Schema.Types.ObjectId,
        ref: "restos"
      },
      order_key: {
        type: String,
        index: true
      },
      tableNo: Number,
      comment: String,
      rating: Number,
      date: {
        type: Date,
        default: new Date()
      },
      menu_category: [
        {
          name: String,
          items: [
            {
              name: String,
              count: Number,
              description: String,
              price: Number
            }
          ]
        }
      ]
    }
  ]
});

module.exports = UserModel;
