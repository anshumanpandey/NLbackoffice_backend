import { getDbInstance } from "../utils/DB";
import { Binary, ObjectID } from "mongodb";
import { addNotification } from "../utils/NotificationManager";

const COLLECTION_NAME = "ScheduledNotification"

export const bootstrapScheduledNotification = async () => {
  const db = getDbInstance();
  const collections = await db.listCollections().toArray();

  const found = collections.find(r => r.name == COLLECTION_NAME)

  if (!found) return db.createCollection(COLLECTION_NAME);
  return Promise.resolve();
}

export const saveScheduledNotification = async (notification: any) => {
  const db = getDbInstance();
  const userCollection = db.collection<ScheduledNotification>(COLLECTION_NAME)
  if (notification.id) {
    const { id, ...n } = notification
    await userCollection.updateOne({ _id: new ObjectID(id) }, { $set: n })    
  } else {
    const n = await userCollection.insertOne(notification)
    //addNotification(n.ops[0])
  }
  return { success: true }
}

export const getScheduledNotification = async () => {
  const db = getDbInstance();
  const userCollection = db.collection<ScheduledNotification>(COLLECTION_NAME)
  return userCollection.find().toArray()
}

export const deleteScheduledNotification = async (id: string) => {
  const db = getDbInstance();
  const userCollection = db.collection<ScheduledNotification>(COLLECTION_NAME)
  return userCollection.deleteOne({ _id: new ObjectID(id) })
}

export interface ScheduledNotification {
  _id: string | ObjectID;
  minuteSpan: number;
}
