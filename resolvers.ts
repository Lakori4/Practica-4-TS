import { Collection, ObjectId } from "mongodb";
import { ModelPart, ModelVehicle, Part, Vehicle } from "./types.ts";


export const resolvers = {
    Query: {

    },
    Mutation: {
        addVehicle: async (
            _: unknown,
            args: { name: string, manufacturer: string, year: number},
            context: {
                vCollection: Collection<ModelVehicle>;
                pCollection: Collection<ModelPart>;
            },
        ): Promise<Vehicle> => {
            const { name, manufacturer, year } = args;

            const insertedID = await context.vCollection.insertOne({
                name,
                manufacturer,
                year,
                parts: [],
            })

            const vModel = {
                _id: insertedID,
                name,
                manufacturer,
                year,
                parts: [],
            };
            return change(vModel);
        }
        addPart: async (
            _: unknown,
            args : { name: string, price: number, vehicleID: ObjectId },
            context: {
                vCollection: Collection<ModelVehicle>;
                pCollection: Collection<ModelPart>;
            }, 
        ): Promise<Part> => {
                const { name, price, vehicleID } = args;
                const insertedID = await 
            }
    }
}