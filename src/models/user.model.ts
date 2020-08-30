import { getDbInstance, getMongoClient } from "../utils/DB";
import { ObjectID, Binary } from "mongodb";
import { BASE_URL } from "../utils/Constanst";
import { deleteBookingsByUser } from "./bookings.model";
import { deletePostsByUser } from "./post.model";

const COLLECTION_NAME = "Users"

export const saveUser = (user: UserData) => {
  const db = getDbInstance()
  const userCollection = db.collection<UserData>(COLLECTION_NAME)
  return userCollection.insertOne(user)
}


export const getUsers = (filter?: { type: string }) => {
  const db = getDbInstance()
  const userCollection = db.collection<UserData>(COLLECTION_NAME)
  return userCollection
  .aggregate([{
    "$lookup": {
      from: "Users",
      localField: "ConnectedUsers.UserId",
      foreignField: "_id",
      as: "ConnectedUsers"
    },
  },
  ])
  .toArray().then(users => users.map(u => {
    delete u.Password;
    u.ProfileImage = u.ProfileImage ? `${BASE_URL}${u.ProfileImage}`: u.ProfileImage;
    if (u.DBSCeritificate && u.DBSCeritificate.Path) {
      u.DBSCeritificate.Path = `${BASE_URL}${u.DBSCeritificate.Path}`;
    }
    if (u.VerificationDocument && u.VerificationDocument.Path) {
      u.VerificationDocument.Path = `${BASE_URL}${u.VerificationDocument.Path}`;
    }

    if (u.TrainingLocations && u.TrainingLocations.length != 0) {
      u.TrainingLocations = u.TrainingLocations.map(element => {
        element.ImageUrl = `${BASE_URL}${element.ImageUrl}`
        return element
      });
    }
    return u
  }))
}

export const deleteUser = async (id: string) => {
  const db = getDbInstance()
  const userCollection = db.collection<UserData>(COLLECTION_NAME)
  const client = getMongoClient()
  const session = client.startSession()
  try {
    await userCollection.deleteOne({ _id: new Binary(new Buffer(id, "base64"), 3) }, { session })
    await deleteBookingsByUser(id, { session });
    await deletePostsByUser(id, { session })
  } finally {
    await session.endSession();
  }
}

export const setVerify = (id: string, isVerified: boolean, entity: "DBSCeritificate" | "VerificationDocument") => {
  const db = getDbInstance()
  const userCollection = db.collection<UserData>(COLLECTION_NAME)
  if (entity == "DBSCeritificate") {
    return userCollection.updateOne({ _id: new Binary(new Buffer(id, "base64"), 3) }, { $set: { "DBSCeritificate.Verified": isVerified}})    
  }
  if (entity == "VerificationDocument") {
    return userCollection.updateOne({ _id: new Binary(new Buffer(id, "base64"), 3) }, { $set: { "VerificationDocument.Verified": isVerified}})    
  }
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
  ProfileImage: string | null;
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
  DBSCeritificate: null | { Type: string, Path: string, Verified: true };
  VerificationDocument: null | { Type: string, Path: string, Verified: true };
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