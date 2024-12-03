
import { ApolloServer } from "@apollo/server";
import { MongoClient } from "mongodb";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ModelPart, ModelVehicle } from "./types.ts";
import { typeDefs } from "./typeDefs.ts";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = "mongodb+srv://aperedas:18062004@backend.61kmp.mongodb.net/?retryWrites=true&w=majority&appName=Backend";


const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.log("Conectado a MongoDB");

const mongoDB = mongoClient.db("CarDealer");        

const VehicleCollection = mongoDB.collection<ModelVehicle>("Vehicle");
const PartCollection = mongoDB.collection<ModelPart>("Part");

const server = new ApolloServer({
    typeDefs,
    resolvers
})

const { url } = await startStandaloneServer(server, {
    context: async () => ({ VehicleCollection, PartCollection }),
  });
  console.log(`🚀  Server ready at: ${url}`);