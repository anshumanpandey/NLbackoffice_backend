import { getDbInstance } from "../utils/DB";
import { ObjectID } from "mongodb";
import { ApiError } from "../utils/ApiError";

enum NotificationType {
  RealTime = "RealTime",
  Schedule = "Schedule",
}

const COLLECTION_NAME = "ScheduledNotification";

export const bootstrapScheduledNotification = async () => {
  const db = getDbInstance();
  const collections = await db.listCollections().toArray();

  const found = collections.find((r) => r.name == COLLECTION_NAME);

  if (!found) return db.createCollection(COLLECTION_NAME);
  return Promise.resolve();
};

type NotificationResolver = (body: any) => Record<string, any>;

const getRealTimeNotificationBody: NotificationResolver = (body: any) => {
  if (!body.event) throw new ApiError("Missing event");

  return {
    body: body.body,
    userType: body.userType,
    event: body.event,
    type: NotificationType.RealTime,
  } as Record<string, any>;
};

const getScheduleNotificationBody: NotificationResolver = (body: any) => {
  if (!body.timeSpan) throw new ApiError("Missing Time Span");
  return {
    body: body.body,
    userType: body.userType,
    timeSpan: body.timeSpan,
    type: NotificationType.Schedule,
  } as Record<string, any>;
};

export const saveScheduledNotification = async (notification: any) => {
  const db = getDbInstance();
  const userCollection = db.collection<ScheduledNotification>(COLLECTION_NAME);
  const jsonBody =
    notification.type === NotificationType.RealTime
      ? getRealTimeNotificationBody(notification)
      : getScheduleNotificationBody(notification);
  if (notification?.id) {
    jsonBody.id = notification?.id;
  }
  if (jsonBody.id) {
    const { id, ...n } = jsonBody;
    await userCollection.updateOne({ _id: new ObjectID(id) }, { $set: n });
  } else {
    const n = await userCollection.insertOne(jsonBody);
  }
  return { success: true };
};

export const getScheduledNotification = async () => {
  const db = getDbInstance();
  const userCollection = db.collection<ScheduledNotification>(COLLECTION_NAME);
  return userCollection.find().toArray();
};

export const deleteScheduledNotification = async (id: string) => {
  const db = getDbInstance();
  const userCollection = db.collection<ScheduledNotification>(COLLECTION_NAME);
  return userCollection.deleteOne({ _id: new ObjectID(id) });
};

export interface ScheduledNotification {
  _id: string | ObjectID;
}
