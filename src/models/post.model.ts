import { getDbInstance } from "../utils/DB";
import { Binary } from "mongodb";
import { BASE_URL } from "../utils/Constanst";

const COLLECTION_NAME = "Posts"

export const getPost = (filter?: { type: string }) => {
  const db = getDbInstance()
  const userCollection = db.collection<PostData>(COLLECTION_NAME)
  return userCollection.aggregate([{
    "$lookup": {
      from: "Users",
      localField: "UserId",
      foreignField: "_id",
      as: "User"
    },
  },
  { "$unwind": { path: "$User"}, }
  ]).toArray().then(el => el.map(r => ({ ...r, MediaURL: `${BASE_URL}${r.MediaURL}` })))
}

export const deletePosts = (id: string) => {
  const db = getDbInstance()
  const userCollection = db.collection<PostData>(COLLECTION_NAME)
  return userCollection.deleteOne({ _id: new Binary(new Buffer(id, "base64"), 3) })
}

export const deletePostsByUser = (userId: string, options?: any) => {
  const db = getDbInstance()
  const userCollection = db.collection<PostData>(COLLECTION_NAME)
  return userCollection.deleteOne({ UserId: new Binary(new Buffer(userId, "base64"), 3) }, { session: options.session || undefined})
}

export interface PostData {
  Id:            string;
  UserID:        string;
  Header:        null;
  Body:          string;
  MediaURL:      string;
  NumberOfLikes: number;
  IsVerified:    boolean;
  CreatedDate:   Date;
  Comments:      any[];
  Likes:         any[];
}