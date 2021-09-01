import { getDbInstance } from "../utils/DB";

const COLLECTION_NAME = "Messages";

export const getMessages = () => {
  const db = getDbInstance();
  const userCollection = db.collection<Message>(COLLECTION_NAME);
  const userFieldsToInclude = { _id: 1, FullName: 1 };
  return userCollection
    .aggregate([
      {
        $lookup: {
          from: "Users",
          as: "Sender",
          let: { senderId: "$SenderId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$senderId", "$_id"] },
              },
            },
            { $project: userFieldsToInclude },
          ],
        },
      },
      { $unwind: { path: "$Sender" } },
      {
        $lookup: {
          from: "Users",
          as: "Receiver",
          let: { receiverId: "$ReceiverId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$receiverId", "$_id"] },
              },
            },
            { $project: userFieldsToInclude },
          ],
        },
      },
      { $unwind: { path: "$Receiver" } },
    ])
    .sort({ SentDate: 1 })
    .toArray();
};

export interface Message {
  _id: string;
  Text: string;
  ImageUrl: null;
  SenderId: string;
  ReceiverId: string;
  SentDate: Date;
}
