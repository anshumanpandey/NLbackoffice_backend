import { MongoClient, Db } from "mongodb"
import { ApiError } from "./ApiError";
 
// Database Name
const dbName = process.env.DB_NAME || "NextLevelTraining";

// Connection URL
const url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_IP || "44.233.116.105"}:${process.env.DB_PORT || "27017"}/${dbName}`;

let DbInstance: Db | null = null
 
// Use connect method to connect to the server
export const checkConnection = () => {
  return new Promise((res,rej) => {
  MongoClient.connect(url, {useUnifiedTopology: true }, function(err, client) {
      if (err) {
        rej(err)
        return
      }
      console.log("Connected successfully to server");
     
      DbInstance = client.db();
      res()
    });
  })
}

export const getDbInstance = () => {
  if (!DbInstance) throw new ApiError("Failed to connect to server")
  return DbInstance
}