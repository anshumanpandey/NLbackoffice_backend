import { getDbInstance } from "../utils/DB";
import { Binary } from "mongodb";
import { getBookings } from "./bookings.model";


export const getReviews = async (filter?: { type: string }) => {
  const users = await getBookings()
  const reviews = users.reduce<any[]>((arr, u) => {
    arr.push(...u.Reviews)
    return arr
  },[])

  return reviews
}

export const deleteReview = (id: string) => {
  const db = getDbInstance()
  const _id = new Binary(new Buffer(id, "base64"), 3)

  const reviewsCollection = db.collection<UserData>("Bookings")
  return reviewsCollection.updateOne(
    { "Reviews._id": new Binary(new Buffer(id, "base64"), 3)},
    { $pull: {"Reviews": { _id }}},
    )
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