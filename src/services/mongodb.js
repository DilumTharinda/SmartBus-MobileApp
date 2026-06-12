import { MongoClient } from "mongodb";
import { MONGODB_URI, DB_NAME } from "../config/keys";

let client = null;
let db = null;

export const connectDB = async () => {
  if (db) return db;
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("MongoDB connected");
  return db;
};

export const getCollection = async (name) => {
  const database = await connectDB();
  return database.collection(name);
};