import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let client;
let db;

export async function getDb() {
    if (db) return db;
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI missing");
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(); // uses DB from URI
    return db;
}