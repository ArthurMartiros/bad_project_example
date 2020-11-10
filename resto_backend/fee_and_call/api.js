const router = require("express").Router();
const authorize = require("../authorization");
const response = require("../init/response");
const routes = require("./routes");
const FeeAndCallService = require("./service");
const UserServices = require("../users/service");
const configs = require("../admins/configs");
const deviceTypes = require("../users/models/device.types");

router.post(
  `/${routes.ACCEPT_FEE_OR_CALL}`,
  authorize.Authorize,
  async (req, res) => {
    //   {
    //       query: {
    //           fee_call_id
    //           member_id
    //           member_name
    //       }
    //   }
    try {
      const fee_call = await FeeAndCallService.get(req.body.query.fee_call_id);
      if (!fee_call || fee_call.is_order_accepted)
        return res.status(405).send(response.error.order_accepted);
      const user = await UserServices.getUserById(fee_call.client._id, {
        select: "device_token device_os"
      });
      if (!user || !user.device_token || !user.device_os)
        return res.status(400).send(response.error.failed_process);
      if (user.device_os == deviceTypes.ios) {
        const result = await UserServices.sendPushNotification(
          `Hi, my name is ${req.body.query.member_name}. Your request was successfully accepted.`,
          user.device_token,
          configs.bundleId.client,
          {
            title: "Your request has been accepted!",
            order_key: fee_call.order_key,
            type: fee_call.type,
            waiter_name: req.body.query.member_name
          }
        );
        if (result.failed.length)
          return res.status(400).send(response.error.failed_send_push_ios);
      } else {
        // TO DO FOR ANDROID
        return res.status(400).send(response.error.unsupported_request);
      }
      await FeeAndCallService.accept(fee_call._id, {
        assignee_id: req.body.query.member_id,
        name: req.body.query.member_name
      });

      return res.status(200).send({ success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).send(response.error.failed_process);
    }
  }
);

router.post(`/${routes.GET_ALL}`, authorize.Authorize, async (req, res) => {
  const data = await FeeAndCallService.getAll();
  return res.status(200).send(data);
});

router.post(
  `/${routes.GET_FILTERED_BY_ACCEPTED}`,
  authorize.Authorize,
  async (req, res) => {
    //   {
    //       query: {
    //           accepted: Boolean
    //       }
    //   }
    const data = await FeeAndCallService.getFilteredByAccepted(
      req.body.query.accepted
    );
    return res.status(200).send(data);
  }
);

module.exports = router;
