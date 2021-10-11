import { Binary } from "mongodb";
import { getDbInstance, Transactionable } from "../utils/DB";

const COLLECTION_NAME = "Leads";

export const getHistory = () => {
  const db = getDbInstance();
  const userCollection = db.collection<Lead>(COLLECTION_NAME);
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

export const createLead = (
  params: LeadCreationParams,
  opt?: Transactionable
) => {
  const db = getDbInstance();
  const options = {
    session: opt?.t,
  };
  const userCollection = db.collection<LeadCreationParams>(COLLECTION_NAME);

  return userCollection.insertOne(params, options);
};

export interface Lead {
  _id: string;
  FullName: string;
  EmailID: string;
  MobileNo: string;
  Location: string;
  CreatedAt: Date;
  Experience: string;
  Age: string;
  MaximumPrice: string;
  CoachingType: string[];
  Days: string[];
  CoachingTime: string[];
  DaysOfWeek: string[];
  Web: boolean;
  UserId: string | Binary;
}

export type LeadCreationParams = Omit<Lead, "_id" | "CreatedAt">;
