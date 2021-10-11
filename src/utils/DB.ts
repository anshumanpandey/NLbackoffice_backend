import { MongoClient, Db, ClientSession } from "mongodb";
import { ApiError } from "./ApiError";

// Database Name
const dbName = process.env.DB_NAME || "NextLevelTraining";

// Connection URL
const url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${
  process.env.DB_IP || "44.232.144.218"
}:${process.env.DB_PORT || "27017"}/${dbName}`;

let DbInstance: Db | null = null;
let mongoClient: MongoClient | null = null;

// Use connect method to connect to the server
export const checkConnection = () => {
  return new Promise<void>((res, rej) => {
    MongoClient.connect(
      url,
      { useUnifiedTopology: true },
      function (err, client) {
        if (err) {
          rej(err);
          return;
        }
        console.log("Connected successfully to server");

        mongoClient = client;
        DbInstance = client.db();
        res();
      }
    );
  });
};

export const getDbInstance = () => {
  if (!DbInstance) throw new ApiError("Failed to connect to server");
  return DbInstance;
};

export const getMongoClient = () => {
  if (!mongoClient) throw new ApiError("Failed to connect to server");
  return mongoClient;
};

export const startTransaction = () => {
  let connectionForTransaction = getMongoClient();
  const db = connectionForTransaction.db();

  const session = connectionForTransaction.startSession();
  session.startTransaction();
  return session;
};

export const finishTransaction = async (session: ClientSession) => {
  await session.commitTransaction();
  session.endSession();
};

export const abortTransaction = async (session: ClientSession) => {
  await session.abortTransaction();
  session.endSession();
};

export type Transactionable = {
  t?: ClientSession;
};
