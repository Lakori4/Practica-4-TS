import { Collection, ObjectId } from "mongodb";
import { ModelPart, ModelVehicle, Part, Vehicle } from "./types.ts";
import { change, FromModelToPart } from "./utils.ts";

export const resolvers = {
    Query: {

        vehicles: async(
            _:unknown,
            __:unknown,
            context: { VehicleCollection: Collection<ModelVehicle>, PartCollection: Collection<ModelPart> }
        ): Promise<Vehicle[]> => {
            const result = await context.VehicleCollection.find().toArray()
            const resultFinal = await Promise.all(result.map(e => change(e,context.PartCollection)))
            return resultFinal
        },
        
        vehicle: async(
            _:unknown,
            args: {id: string},
            context: { VehicleCollection: Collection<ModelVehicle>, PartCollection: Collection<ModelPart> }
        ): Promise<Vehicle|null> => {
            const result = await context.VehicleCollection.findOne({_id:new ObjectId(args.id)})
            if(!result) return null
            return change(result,context.PartCollection)
        },

        parts: async(
            _:unknown,
            __:unknown,
            context: { PartCollection: Collection<ModelPart> }
        ): Promise<Part[]> => {
            const result = await context.PartCollection.find().toArray()
            const resultFinal =  result.map(e => FromModelToPart(e))
            return resultFinal
        },

        vehiclesByManufacturer: async(
            _:unknown,
            args: {manufacturer:string},
            context: { VehicleCollection: Collection<ModelVehicle>, PartCollection: Collection<ModelPart> }
        ): Promise<Vehicle[]> => {
            const result = await context.VehicleCollection.find(args).toArray()
            const resultFinal = await Promise.all(result.map(e => change(e,context.PartCollection)))
            return resultFinal
        },

        partsByVehicle: async(
            _:unknown,
            args: {vehicleId:string},
            context: { PartCollection: Collection<ModelPart> }
        ): Promise<Part[]> => {
            const result = await context.PartCollection.find({vehicleId:new ObjectId(args.vehicleId)}).toArray()
            const resultFinal = result.map(e => FromModelToPart(e))
            return resultFinal
        },

        vehiclesByYearRange: async(
            _:unknown,
            args: {startYear:number, endYear:number},
            context: { VehicleCollection: Collection<ModelVehicle>, PartCollection: Collection<ModelPart> }
        ): Promise<Vehicle[]> => {
            const result = await context.VehicleCollection.find({year: {$lte:args.endYear,$gte:args.startYear}}).toArray()
            const resultFinal = await Promise.all(result.map(e => change(e,context.PartCollection)))
            return resultFinal
        }
    },  
    Mutation: {

    }
}