const DBConnection = require("../connections");

class BaseDAO {
  constructor(collection, schema) {
    if (!collection || !schema) {
      throw "Protocol Violation";
    }
    this.model = DBConnection.model(collection, schema);
  }

  fetchMany(query, options) {
    query = query || {};
    options = options || {};
    return this.model
      .find(query)
      .limit(options.limit)
      .skip(options.offset)
      .sort(options.sort || {})
      .select(options.select || {})
      .populate(options.populate || "")
      .exec();
  }

  fetchOne(query, options) {
    query = query || {};
    options = options || {};
    options.select = options.select || {};
    options.populate = options.populate || "";
    return this.model
      .findOne(query)
      .populate(options.populate)
      .select(options.select)
      .exec();
  }
  collectionCount(query) {
    return this.model.count(query);
  }

  insert(obj, push) {
    // return this.model.create(obj);
    return new Promise((resolve, reject) => {
      this.model
        .create(obj)
        .then(async data => {
          if (push) {
            let obj = {};
            let key = push.pushKey;
            let val = push.pushValue;
            obj[key] = val;
            this.pushUpdate({ _id: data._id }, obj)
              .then(() => {})
              .catch(err => {});
            // data[key].push(val);
            // data.save();
          }
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  updateById(id, obj) {
    if (!id || JSON.stringify(obj) == "{}") {
      throw "missing parameter";
    }
    return this.model.findOneAndUpdate(
      id,
      { $set: obj },
      { runValidators: true }
    );
  }

  updateOne(query, obj) {
    if (!query || JSON.stringify(query) == "{}") {
      throw "missing parameter";
    }
    return this.model.updateOne(query, { $set: obj });
  }
  justUpdate(query, target) {
    if (!query || JSON.stringify(query) == "{}") {
      throw "missing parameter";
    }
    return this.model.update(query, target);
  }
  genericUpdate(query, obj) {
    if (!query || JSON.stringify(query) == "{}") {
      throw "missing parameter";
    }
    return this.model.updateOne(query, obj);
  }
  genericUpdateMany(query, obj) {
    if (!query || JSON.stringify(query) == "{}") {
      throw "missing parameter";
    }
    return this.model.updateMany(query, obj);
  }
  pushUpdate(query, obj) {
    if (!query || JSON.stringify(query) == "{}") {
      throw "missing parameter";
    }

    return this.model.updateOne(
      query,
      { $push: obj },
      {
        multi: true
        // new: true
      }
    );
  }
  remove(query) {
    if (!query || JSON.stringify(query) == "{}") {
      throw "missing parameter";
    }
    return this.model.deleteOne(query);
  }
  removeMany(query) {
    if (!query || JSON.stringify(query) == "{}") {
      throw "missing parameter";
    }
    return this.model.deleteMany(query);
  }
}

module.exports = BaseDAO;
