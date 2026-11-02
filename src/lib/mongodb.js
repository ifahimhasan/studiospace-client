import { MongoClient } from "mongodb";

// The driver connects lazily, so a placeholder URI keeps `next build` working
// on machines without secrets. Real requests need MONGODB_URI to be set.
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

const globalForMongo = globalThis;
const client = globalForMongo._ssMongo ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForMongo._ssMongo = client;

export const db = client.db(process.env.DB_NAME || "studiospace");
