import { getDbInstance } from "../utils/DB";

const COLLECTION_NAME = "Leads";

export const getHistory = () => {
  const db = getDbInstance();
  const userCollection = db.collection<Leads>(COLLECTION_NAME);
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

export interface Leads {
  _id: string;
  FullName: string;
  EmailID: string;
  MobileNo: string;
  Location: string;
  CreatedAt: Date;
  Experience: string;
  Age: string;
  CoachingType: string[];
  Days: string[];
  CoachingTime: string[];
  DaysOfWeek: string[];
  UserId: string;
}
