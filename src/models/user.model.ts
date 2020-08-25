import { getDbInstance } from "../utils/DB";
import { ObjectID } from "mongodb";

const COLLECTION_NAME = "Users"

export const saveUser = (user: UserData) => {
  const db = getDbInstance()
  const userCollection = db.collection<UserData>(COLLECTION_NAME)
  return userCollection.insertOne(user)
}


export const getUsers = (filter?: { type: string}) => {
  const db = getDbInstance()
  const userCollection = db.collection<UserData>(COLLECTION_NAME)
  return userCollection.find({}).toArray().then(users => users.map(u => { delete u.Password; return u }))
}

export const deleteUser = (id: string) => {
  const db = getDbInstance()
  const userCollection = db.collection<UserData>(COLLECTION_NAME)
  return userCollection.deleteOne({ _id: new ObjectID(id) })
}

export interface UserData {
  _id:                  string | ObjectID;
  FullName:             string;
  Address:              string;
  EmailID:              string;
  DeviceID:             string;
  MobileNo:             string;
  PostCode:             string;
  Password:             string;
  AccessToken:          null;
  SocialLoginType:      null;
  ProfileImageHeight:   null;
  ProfileImageWidth:    null;
  IsTempPassword:       boolean;
  Role:                 string;
  ProfileImage:         null;
  Achievements:         string;
  AboutUs:              string;
  Accomplishment:       null;
  Lat:                  string;
  Lng:                  string;
  Rate:                 number;
  TravelMile:           null;
  BankAccount:          null;
  Experiences:          any[];
  TravelPostCodes:      any[];
  Availabilities:       any[];
  DBSCeritificate:      null;
  VerificationDocument: null;
  TrainingLocations:    any[];
  Teams:                Team[];
  UpcomingMatches:      UpcomingMatch[];
  Coaches:              Coach[];
  Reviews:              any[];
  HiddenPosts:          any[];
  ConnectedUsers:       any[];
  Qualifications:       any[];
}

export interface Coach {
  CoachId: string;
  Status:  string;
}

export interface Team {
  _id:       string;
  TeamName:  string;
  TeamImage: null;
  StartDate: Date;
  EndDate:   number;
}

export interface UpcomingMatch {
  _id:       string;
  TeamName:  string;
  MatchDate: Date;
}