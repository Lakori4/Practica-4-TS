
import { ApolloServer } from "@apollo/server";
import { MongoClient } from "mongodb";
import { startStandaloneServer } from "@apollo/server/standalone";

const MONGO_URL = "mongodb+srv://nebrija:nebrija@clusteryolo.wvdnt.mongodb.net/?retryWrites=true&w=majority&appName=ClusterYolo";

if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.log("")