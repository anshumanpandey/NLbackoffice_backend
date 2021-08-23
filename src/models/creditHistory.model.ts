import { getDbInstance } from "../utils/DB";

const COLLECTION_NAME = "CreditHistory";

export const getHistory = () => {
  const db = getDbInstance();
  const userCollection = db.collection<CreditHistory>(COLLECTION_NAME);
  return userCollection
    .aggregate([
      {
        $lookup: {
          from: "Users",
          localField: "UserId",
          foreignField: "_id",
          as: "User",
        },
      },
      { $unwind: { path: "$User" } },
    ])
    .toArray();
};

export interface CreditHistory {
  _id: string;
  CreatedAt: Date;
  Credits: string;
  AmountPaid: string;
  UserId: string;
  PaypalPaymentId: string;
}
