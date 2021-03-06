import { getDbInstance } from "../utils/DB";
import { Binary } from "mongodb";

const COLLECTION_NAME = "Bookings"

export const getBookings = (filter?: { type: string }) => {
  const db = getDbInstance()
  const userCollection = db.collection<UserData>(COLLECTION_NAME)
  return userCollection.aggregate([{
    "$lookup": {
      from: "Users",
      localField: "PlayerID",
      foreignField: "_id",
      as: "Player"
    },
  },
  {
    $unwind: {
      path: "$Player",
    }
  },
  {
    "$lookup": {
      from: "Users",
      localField: "CoachID",
      foreignField: "_id",
      as: "Coach"
    },
  },
  {
    $unwind: {
      path: "$Coach",
    }
  },
  ]).toArray()
}

export const deleteBookings = (id: string) => {
  const db = getDbInstance()
  const userCollection = db.collection<UserData>(COLLECTION_NAME)
  return userCollection.deleteOne({ _id: new Binary(new Buffer(id, "base64"), 3) })
}

export const deleteBookingsByUser = (userId: string, options?: any) => {
  const db = getDbInstance()
  const userCollection = db.collection<UserData>(COLLECTION_NAME)
  return userCollection.deleteMany({ "PlayerID": new Binary(new Buffer(userId, "base64"), 3) }, { session: options.session || undefined})
}

export interface UserData {
  _id: string | Binary;
  FullName: string;
  Address: string;
  EmailID: string;
  DeviceID: string;
  MobileNo: string;
  PostCode: string;
  Password: string;
  AccessToken: null;
  SocialLoginType: null;
  ProfileImageHeight: null;
  ProfileImageWidth: null;
  IsTempPassword: boolean;
  Role: string;
  ProfileImage: null;
  Achievements: string;
  AboutUs: string;
  Accomplishment: null;
  Lat: string;
  Lng: string;
  Rate: number;
  TravelMile: null;
  BankAccount: null;
  Experiences: any[];
  TravelPostCodes: any[];
  Availabilities: any[];
  DBSCeritificate: null;
  VerificationDocument: null;
  TrainingLocations: any[];
  Teams: Team[];
  UpcomingMatches: UpcomingMatch[];
  Coaches: Coach[];
  Reviews: any[];
  HiddenPosts: any[];
  ConnectedUsers: any[];
  Qualifications: any[];
}

export interface Coach {
  CoachId: string;
  Status: string;
}

export interface Team {
  _id: string;
  TeamName: string;
  TeamImage: null;
  StartDate: Date;
  EndDate: number;
}

export interface UpcomingMatch {
  _id: string;
  TeamName: string;
  MatchDate: Date;
}