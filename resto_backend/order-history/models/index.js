const Schema = require("mongoose").Schema;

const OrderHistoryModel = new Schema({
  resto: {
    type: Schema.Types.ObjectId,
    ref: "restos"
  },
  order_key: {
    type: String,
    index: { unique: true }
  },
  is_order_accepted: {
    type: Boolean,
    default: false
  },
  tableNo: Number,
  comment: String,
  rating: Number,
  date: {
    type: Date,
    default: new Date()
  },
  assignee: {
    assignee_id: String,
    name: String
  },
  client_id: {
    type: String,
    required: true
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
});

module.exports = OrderHistoryModel;
