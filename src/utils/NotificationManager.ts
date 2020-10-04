import { ScheduledNotification } from "../models/scheduledNotification.model";
/*import * as admin from "firebase-admin"

admin.initializeApp({
  credential: { getAccessToken: () => Promise.resolve({ access_token: "AAAA2RjxNZQ:APA91bG7Hfe197KNkP7kvofi9-H86wD6UhoK47MUi23dDnFxvDZkifAZy5DGBnLY5CfeVrj5JbyJGgrM4LLdvcd_MWTlrxnYbpmcVu3-avQk02v61WRqVETROUYUqi9_rqFX1bctZjZ7", expires_in: 1000 })},
});

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

admin.messaging().sendToDevice("cho5VJfgQOOKhFxeNb2lbf:APA91bH2SoTWS1kZUsd5vtcwxAU4N4KgGeNnu1WBgm07Di4LsPW9DSsTNndv2oP4fBtfZmybDRptQp-WUij0T6dPWff7U1mdCpGdod-rvxg5qHzDoix3khOCjc3sMmhTHYd2WSZNW8NT", { notification: { body: 'New'}}, notification_options)
*/
const NOTIFICATION_STORE = new Map();

export const addNotification = (notification: ScheduledNotification) => {
    if (NOTIFICATION_STORE.has(notification._id) == false) {
        NOTIFICATION_STORE.set(notification._id, notification)
        setInterval(() => {

        }, notification.minuteSpan * 60000)
    }
}

export const removeNotification = (notification: ScheduledNotification) => {
    if (NOTIFICATION_STORE.has(notification._id) == true) {
        NOTIFICATION_STORE.delete(notification._id)
    }
}

export const rescheduleNotification = () => {
    
}