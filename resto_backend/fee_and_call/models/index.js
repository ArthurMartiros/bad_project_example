const Schema = require("mongoose").Schema;

const FeeAndCallModel = new Schema({
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
  date: {
    type: Date
  },
  assignee: {
    assignee_id: String,
    name: String
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  type: String
});

module.exports = FeeAndCallModel;
