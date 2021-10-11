import { getDbInstance, getMongoClient, Transactionable } from "../utils/DB";
import { Binary } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../utils/Constanst";
import { deleteBookingsByUser } from "./bookings.model";
import { deletePostsByUser } from "./post.model";
import { generatePass } from "../utils/generatePassword";

const COLLECTION_NAME = "Users";

export const saveUser = async (
  user: CreateUserParams,
  opt?: Transactionable
) => {
  const db = getDbInstance();
  const userCollection = db.collection<
    { _id: Binary; password: string } & CreateUserParams
  >(COLLECTION_NAME);
  const options = {
    session: opt?.t,
  };

  const id = Buffer.from(uuidv4(), "binary");
  const luuid = new Binary(id, 3);

  const u = await userCollection.insertOne(
    {
      _id: luuid,
      ...generateUserStoreValues(user),
      password: generatePass(),
    },
    options
  );
  return u.ops[0];
};

export const getUsers = (filter?: { type: string }) => {
  const db = getDbInstance();
  const userCollection = db.collection<UserData>(COLLECTION_NAME);
  return userCollection
    .aggregate([
      {
        $lookup: {
          from: "Users",
          localField: "ConnectedUsers.UserId",
          foreignField: "_id",
          as: "ConnectedUsers",
        },
      },
    ])
    .toArray()
    .then((users) =>
      users.map((u) => {
        delete u.Password;
        u.ProfileImage = u.ProfileImage
          ? `${BASE_URL}${u.ProfileImage}`
          : u.ProfileImage;
        if (u.DBSCeritificate && u.DBSCeritificate.Path) {
          u.DBSCeritificate.Path = `${BASE_URL}${u.DBSCeritificate.Path}`;
        }
        if (u.VerificationDocument && u.VerificationDocument.Path) {
          u.VerificationDocument.Path = `${BASE_URL}${u.VerificationDocument.Path}`;
        }

        if (u.TrainingLocations && u.TrainingLocations.length != 0) {
          u.TrainingLocations = u.TrainingLocations.map((element) => {
            element.ImageUrl = `${BASE_URL}${element.ImageUrl}`;
            return element;
          });
        }
        return u;
      })
    );
};

export const findOne = ({ id }: { id: string }, opt?: Transactionable) => {
  const db = getDbInstance();
  const userCollection = db.collection<UserData>(COLLECTION_NAME);
  const binaryId = new Binary(new Buffer(id, "base64"), 3);
  const criteria = {
    _id: binaryId,
  };
  const options = {
    session: opt?.t,
  };
  const user = userCollection.findOne(criteria, options);
  return user;
};

export const deleteUser = async (id: string) => {
  const db = getDbInstance();
  const userCollection = db.collection<UserData>(COLLECTION_NAME);
  const client = getMongoClient();
  const session = client.startSession();
  try {
    await userCollection.deleteOne(
      { _id: new Binary(new Buffer(id, "base64"), 3) },
      { session }
    );
    await deleteBookingsByUser(id, { session });
    await deletePostsByUser(id, { session });
  } finally {
    await session.endSession();
  }
};

export const setVerify = (
  id: string,
  isVerified: boolean,
  entity: "DBSCeritificate" | "VerificationDocument"
) => {
  const db = getDbInstance();
  const userCollection = db.collection<UserData>(COLLECTION_NAME);
  if (entity == "DBSCeritificate") {
    return userCollection.updateOne(
      { _id: new Binary(new Buffer(id, "base64"), 3) },
      { $set: { "DBSCeritificate.Verified": isVerified } }
    );
  }
  if (entity == "VerificationDocument") {
    return userCollection.updateOne(
      { _id: new Binary(new Buffer(id, "base64"), 3) },
      { $set: { "VerificationDocument.Verified": isVerified } }
    );
  }
};

const generateUserStoreValues = (data: CreateUserParams) => {
  return {
    UserName: "",
    EmailVerified: false,
    DeviceID: "",
    DeviceToken: "",
    PostCode: "",
    Password: "",
    AccessToken: null,
    PaypalPaymentId: "",
    SocialLoginType: null,
    ProfileImageHeight: null,
    ProfileImageWidth: null,
    IsTempPassword: false,
    Featured: false,
    ProfileImage: null,
    Achievements: null,
    AboutUs: null,
    Accomplishment: null,
    Rate: 0,
    Credits: 0,
    TravelMile: null,
    BankAccount: null,
    Experiences: [],
    TravelPostCodes: [],
    Availabilities: [],
    DBSCeritificate: null,
    VerificationDocument: null,
    TrainingLocations: [],
    Teams: [],
    UpcomingMatches: [],
    Coaches: [],
    Reviews: [],
    HiddenPosts: [],
    ConnectedUsers: [],
    Qualifications: [],
    ...data,
  };
};

export interface UserData {
  _id: string | Binary;
  FullName: string;
  UserName: string;
  Address: string;
  EmailID: string;
  DeviceID: string;
  DeviceType: string;
  MobileNo: string;
  PostCode: string;
  Password?: string;
  AccessToken: null;
  State: string;
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
  DBSCeritificate: null | { Type: string; Path: string; Verified: true };
  VerificationDocument: null | { Type: string; Path: string; Verified: true };
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

export type CreateUserParams = Pick<
  UserData,
  | "FullName"
  | "Address"
  | "EmailID"
  | "MobileNo"
  | "Role"
  | "Lat"
  | "Lng"
  | "State"
  | "DeviceType"
>;
