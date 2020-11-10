const router = require("express").Router();
const fs = require("fs");
const mime = require("mime-types");

const routes = require("./routes");
const configs = require("../admins/configs");
const localConfigs = require("./configs");
const UserServices = require("./service");
const AdminService = require("../admins/service");
const OrederHistoryService = require("../order-history/service");
const generateText = require("./helpers/generatetext");

const UserMiddleware = require("./middlewares/index");
var apn = require("apn");
const response = require("../init/response");
const keygen = require("keygenerator");
const order_types = require("./configs/order_types");
const FeeAndCallService = require("../fee_and_call/service");
function generateAPIKey() {
  return keygen._({ length: 6 }).replace(/&/g, "");
}

router.post(
  `/user/${routes.CREATE_USER}`,
  UserMiddleware.create,
  async (req, res) => {
    // {
    // object:{
    //     phone
    //     name
    //     fb_id
    //     device_token
    //     device_os
    // }

    // }
    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    try {
      const data = await UserServices.createUser(req.body.object);
      if (!data) throw new Error("Failed Process Or Duplication Reason");
      return res.status(200).send(data);
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .send({ error: response.error.duplicated_phone_number });
    }
  }
);

router.post(
  `/user/${routes.GET_USER}`,
  UserMiddleware.getUserByPhone,
  async (req, res) => {
    // {
    // query:{
    //      phone
    // }
    // }
    console.log(req.body);
    if (req.Error) {
      return res.status(req.ErroStatus).send(req.Error);
    }
    try {
      const data = await UserServices.getUserByPhone(req.body.query.phone, {
        select: "-order_history"
      });
      if (!data) throw new Error("No User Data");
      return res.status(200).send(data);
    } catch (err) {
      return res.status(400).send({ error: response.error.no_data });
    }
  }
);

router.post(
  `/user/${routes.GET_ORDER_HISTORY}`,
  UserMiddleware.getOrderHistory,
  (req, res) => {
    // {
    //     query:{
    //         user_id
    //     }
    // }
    console.log("User order history request ===>: ", req.body);
    UserServices.getUserOrders({
      _id: req.body.query.user_id
      // 'order_history.resto':req.body.query.resto_id
    })
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        console.log(data);
        return res.status(400).send({ error: response.error.no_data });
      });
  }
);

router.put(`/${routes.ORDER}`, async (req, res) => {
  //  {
  //    items_count
  //    query:{
  //     user_id
  //    }
  //    objet:{
  //     resto: Schema.Types.ObjectId,
  //     tableNo: Number,
  //     comment: String,
  //     rating: Number,
  //     menu_category: [
  //       {
  //         name: String,
  //         items: [
  //           {
  //             name: String,
  //             count: Number,
  //             description: String,
  //             price: Number
  //           }
  //         ]
  //       }
  //     ]
  //    }
  //  }
  console.log(req.body);
  try {
    const client_id = req.body.query.user_id;
    const object = {
      ...req.body.object,
      order_key: generateAPIKey(),
      date: new Date(),
      client_id
    };
    const client = await UserServices.getUserById(req.body.query.user_id, {
      select: "name"
    });
    if (!client) throw new Error("No Such Client");
    const order = await OrederHistoryService.createOrder(object);
    if (!order) throw new Error("Failed Create Order");
    await UserServices.updateUserOrders(
      { _id: req.body.query.user_id },
      { order_history: object }
    );
    const waiters = await AdminService.getMany({
      resto: req.body.query.resto,
      verified: true,
      active: true,
      role: { $gt: configs.roles.manager }
    });
    let content = [];
    waiters.forEach((element, index) => {
      content.push(element.push_notification_device_token);
    });
    const tableNo = object.tableNo;
    const result = await UserServices.sendPushNotification(
      generateText(req.body.items_count, tableNo, client.name),
      content,
      configs.bundleId.uw,
      {
        title: "New Order",
        order_id: order._id,
        items_count: req.body.items_count,
        tableNo: object.tableNo,
        type: order_types.order,
        order_key: order.order_key,
        client_name: client.name || "Unknown Client"
      }
    );
    if (result.failed.length == content.length)
      return res.status(400).send(response.error.failed_send_push_ios);
    return res.status(200).send({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: response.error.failed_process });
  }
});

router.post(`/user/${routes.FEE}`, async (req, res) => {
  // {
  //   query{
  //     resto;
  //     tableNo;
  //     user_id;
  //   }
  // }
  console.log(req.body);
  try {
    const data = await AdminService.getMany({
      restos: req.body.query.resto,
      verified: true,
      active: true,
      role: { $gt: configs.roles.manager }
    });
    let content = [];
    data.forEach((element, index) => {
      content.push(element.push_notification_device_token);
    });
    if (!content.length) throw new Error("Empty Content");
    const client = await UserServices.getUserById(req.body.query.user_id, {
      select: "name"
    });
    if (!client) throw new Error("No Such Client");
    const fee_call = await FeeAndCallService.make({
      resto: req.body.query.resto,
      tableNo: req.body.query.tableNo,
      client: req.body.query.user_id,
      date: new Date().toISOString(),
      type: order_types.fee,
      order_key: generateAPIKey()
    });
    const result = await UserServices.sendPushNotification(
      generateText(null, req.body.query.tableNo, client.name, false, true),
      content,
      configs.bundleId.uw,
      {
        title: `Bill, please`,
        tableNo: req.body.query.tableNo,
        type: order_types.fee,
        fee_call_id: fee_call._id,
        order_key: fee_call.order_key,
        client_name: client.name || "Unknown Client"
      }
    );
    if (result.failed.length == content.length)
      return res.status(400).send(response.error.failed_send_push_ios);
    return res.status(200).send({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: response.error.failed_process });
  }
});

router.post(`/user/${routes.CALL}`, async (req, res) => {
  // {
  //   query{
  //     resto;
  //     tableNo;
  //     user_id;
  //   }
  // }
  try {
    const data = await AdminService.getMany({
      restos: req.body.query.resto,
      verified: true,
      active: true,
      role: { $gt: configs.roles.manager }
    });
    let content = [];
    data.forEach((element, index) => {
      content.push(element.push_notification_device_token);
    });
    if (!content.length) throw new Error("Empty Content");
    const client = await UserServices.getUserById(req.body.query.user_id, {
      select: "name"
    });
    if (!client) throw new Error("No Such Client");
    const fee_call = await FeeAndCallService.make({
      resto: req.body.query.resto,
      tableNo: req.body.query.tableNo,
      client: req.body.query.user_id,
      date: new Date().toISOString(),
      type: order_types.call,
      order_key: generateAPIKey()
    });
    const result = await UserServices.sendPushNotification(
      generateText(null, req.body.query.tableNo, client.name, true),
      content,
      configs.bundleId.uw,
      {
        title: "Can you come, please",
        tableNo: req.body.query.tableNo,
        type: order_types.call,
        fee_call_id: fee_call._id,
        order_key: fee_call.order_key,
        client_name: client.name || "Unknown Client"
      }
    );
    if (result.failed.length == content.length)
      return res.status(400).send(response.error.failed_send_push_ios);
    return res.status(200).send({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: response.error.failed_process });
  }
});

router.put(`/user/${routes.UPDATE_CLIENT}`, async (req, res) => {
  // {
  //   query: {
  //     user_id: String
  //   },
  //   object: {
  //     ...
  //   }
  // }
  console.log(req.body);
  await UserServices.updateUser(req.body.query.user_id, req.body.object);
  return res.status(200).send({ success: true });
});

router.get("/apple-app-site-association", (req, res) => {
  const path = `${__dirname}/configs/apple-app-site-association`;
  fs.readFile(path, function(err, content) {
    if (!err) {
      //          let Ftype = mime.lookup(path);
      //          res.contentType(Ftype);
      //         res.setHeader("Cache-Control", "public, max-age=31557600");
      return res.status(200).send(content);
    }
    return res.status(400).send({ error: response.error.no_data });
  });
});

module.exports = router;
