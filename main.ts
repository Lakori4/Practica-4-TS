
import { ApolloServer } from "@apollo/server";
import { MongoClient } from "mongodb";
import { startStandaloneServer } from "@apollo/server/standalone";

const MONGO_URL = "mongodb+srv://aperedas:18062004@backend.61kmp.mongodb.net/?retryWrites=true&w=majority&appName=Backend";


const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.log("Conectado a MongoDB");

const mongoDB = mongoClient.db("CarDealer");

const vehicleCollection = mongoDB.collection<ModelVehicle>("Vehicle");
const partCollection = mongoDB.collection<ModelPart>("part");