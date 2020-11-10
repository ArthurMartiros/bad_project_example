const router = require("express").Router();
const deviceTypes = require("../users/models/device.types");
const routes = require("./routes");
const OrderHistoryService = require("./service");
const response = require("../init/response");
const AdminService = require("../admins/service");
const configs = require("../admins/configs");
const authorize = require("../authorization");
const UserServices = require("../users/service");
const order_types = require("../users/configs/order_types");

router.post(`/${routes.GET_ORDERS}`, authorize.Authorize, (req, res) => {
  // {
  //   query{
  //     resto
  //   }
  //   filter {
  //     skip
  //     limit
  //     sort
  //   }
  // }
  console.log(req.body.query);

  OrderHistoryService.getAllOrders(
    { resto: req.body.query.resto },
    { sort: { date: -1 } }
  )
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      return res.status(400).send(response.error.no_data);
    });
});

router.post(
  `/${routes.GET_UNACCEPTED_ORDERS}`,
  authorize.Authorize,
  (req, res) => {
    // {
    //   query{
    //     resto
    //   }
    // }
    console.log(req.body.query);

    OrderHistoryService.getAllOrders({
      resto: req.body.query.resto,
      is_order_accepted: false
    })
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        return res.status(400).send(response.error.no_data);
      });
  }
);

router.post(`/${routes.GET_ORDER}`, authorize.Authorize, async (req, res) => {
  // {
  //     query{
  //       order_id
  //     }
  // }
  console.log(req.body.query);
  try {
    const data = await OrderHistoryService.getOrder(req.body.query);
    return data
      ? res.status(200).send(data)
      : res.status(400).send(response.error.no_data);
  } catch (err) {
    console.log(err);
    return res.status(400).send(response.error.no_data);
  }
});

router.post(
  `/${routes.ACCEPT_ORDER}`,
  authorize.Authorize,
  async (req, res) => {
    //  {
    //   query{
    //     order_id
    //     member_id
    //     member_name
    //   }
    // }
    console.log(req.body.query);
    try {
      const data = await OrderHistoryService.getOrder(
        {
          order_id: req.body.query.order_id
        },
        { select: "client_id is_order_accepted order_key" }
      );

      if (!data || !data.client_id)
        return res.status(400).send(response.error.no_data);
      if (data.is_order_accepted)
        return res.status(405).send(response.error.order_accepted);
      const user = await UserServices.getUserById(data.client_id, {
        select: "device_token device_os"
      });
      if (!user || !user.device_token || !user.device_os)
        return res.status(400).send(response.error.failed_process);
      if (user.device_os == deviceTypes.ios) {
        const result = await UserServices.sendPushNotification(
          `Hi, my name is ${req.body.query.member_name}. Your order was successfully accepted and we are preparing it.`,
          user.device_token,
          configs.bundleId.client,
          {
            title: "Your order has been accepted!",
            order_key: data.order_key,
            type: order_types.order,
            waiter_name: req.body.query.member_name
          }
        );
        if (result.failed.length)
          return res.status(400).send(response.error.failed_send_push_ios);
      } else {
        // TO DO FOR ANDROID
        return res.status(400).send(response.error.unsupported_request);
      }
      await OrderHistoryService.orderAccepted(req.body.query);
      return res.status(200).send({ success: true });
    } catch (err) {
      console.log(err);
      return res.status(400).send(response.error.failed_process);
    }
  }
);

router.get(`/${routes.GET_ORDERS_COUNT}`, async (req, res) => {
  try {
    const activeOrders = await OrderHistoryService.getOrdersCount({
      resto: req.query.resto,
      is_order_accepted: false
    });
    const allOrders = await OrderHistoryService.getOrdersCount({
      resto: req.query.resto
    });
    return res.status(200).send({ activeOrders, allOrders });
  } catch (err) {
    console.log(err);
    return res.status(400).send(response.error.no_data);
  }
});
module.exports = router;
