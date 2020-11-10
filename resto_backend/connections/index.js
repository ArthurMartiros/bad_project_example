const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);

mongoose
  .connect(
    `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(err => {
    console.log("Error Db Connection: ", err);
  });

module.exports = mongoose;
