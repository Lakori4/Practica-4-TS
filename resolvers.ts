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
        addVehicle: async (
            _: unknown,
            args: { name: string, manufacturer: string, year: number},
            context: {
                VehicleCollection: Collection<ModelVehicle>;
                PartCollection: Collection<ModelPart>;
            },
        ): Promise<Vehicle| null> => {
            const { name, manufacturer, year } = args;

            const result = await context.VehicleCollection.findOne({manufacturer, year})

            if ((!name || !manufacturer || !year) || result?.name === name) {
                return null
            }
            

            const { insertedId } = await context.VehicleCollection.insertOne({
                name,
                manufacturer,
                year,
                parts: [],
            })
            

            const vModel = {
                _id: insertedId,
                name,
                manufacturer,
                year,
                parts: new Array<ObjectId>,
            };
            return change(vModel, context.PartCollection);
        },
        addPart: async (
            _: unknown,
            args : { name: string, price: number, vehicleId: string },
            context: {
                VehicleCollection: Collection<ModelVehicle>;
                PartCollection: Collection<ModelPart>;
            }, 
        ): Promise<Part | null> => {
            const { name, price, vehicleId } = args;

            const result = await context.VehicleCollection.findOne({_id: new ObjectId (vehicleId)})
           
            if (!name || !price || !vehicleId || !result) {
                return null
            }
            const { insertedId } = await context.PartCollection.insertOne({
                name,
                price,
                vehicleId: new ObjectId(vehicleId),
            })
            await context.VehicleCollection.updateOne(
                { _id: new ObjectId (vehicleId) },
                { $push: {parts: insertedId}}
            )

            const pModel = {
                _id: insertedId,        
                name,
                price,
                vehicleId: new ObjectId(vehicleId),
            }
            return FromModelToPart(pModel)
        },
        updateVehicle: async (
            _: unknown,
            args: { id: string, name:string, manufacturer:string, year: number},
            context: {
                VehicleCollection: Collection<ModelVehicle>;
                PartCollection: Collection<ModelPart>;
            },
        ): Promise<Vehicle| null> => {
            const {id, name, manufacturer, year } = args

            const result = await context.VehicleCollection.findOne({manufacturer, year})

            if ((!name || !manufacturer || !year) || result?.name === name) {
                return null
            }

            const { modifiedCount } = await context.VehicleCollection.updateOne(
                { _id: new ObjectId (id) },
                { $set: {name, manufacturer, year}}
            )

            if (!modifiedCount) {
                return null
            }

            const vModel = {
                _id: new ObjectId (id),
                name,
                manufacturer,
                year,
                parts: (await context.PartCollection.find({vehicleId: new ObjectId (id)}).toArray()).map (e => e._id),
            }
            return change(vModel, context.PartCollection)
        },
        deletePart: async (
            _: unknown,
            args: { id:string },
            context: {
                VehicleCollection: Collection<ModelVehicle>;
                PartCollection: Collection<ModelPart>;
            },
        ): Promise <Part | null> => {

            const { id } = args

            const result = await context.PartCollection.findOne({_id:new ObjectId(id)})

            if (!result) {
                return null
            }

            context.PartCollection.deleteOne({_id: new ObjectId (id)});

            await context.VehicleCollection.updateOne(
                { _id: new ObjectId (result.vehicleId) },
                { $pull: {parts: new ObjectId (id)}}
            )

            const pModel = {
                _id: result._id,
                name: result.name,
                price: result.price,
                vehicleId: result.vehicleId
            }
            return FromModelToPart(pModel)
        }
    }
}