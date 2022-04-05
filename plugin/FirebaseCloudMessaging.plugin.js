const firebaseAdmin = require("firebase-admin");
const firebaseServiceAccount = require("../fcm_helpinghands.json");
const DeviceModel = require("../model/Device.model");

const firebase_push_notification = firebaseAdmin.initializeApp(
  {
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
  },
  "firebase_push_notification"
);

exports.SendPushNotification = async (customer_id, title, message) => {
  const messaging = firebase_push_notification.messaging();
  const device = await DeviceModel.find({
    account_number: customer_id,
  });
  console.log(device, 1223);
  if (device.length === 0) {
    return;
  }
  var message_list = [];
  device.map((device) => {
    if (device.notification_token) {
      message_list.push({
        notification: {
          title: title,
          body: message,
        },
        android: {
          priority: "high",
          notification: {
            channel_id: "1020120324",
          },
        },
        token: device.notification_token,
      });
    }
  });
  if (message_list.length === 0) {
    return;
  }

  const res = await messaging.sendAll(message_list);
  console.log(res, 111);
};
