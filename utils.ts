import { ModelPart, ModelVehicle, Part, Vehicle } from "./types.ts";
import { Collection, ObjectId } from "mongodb";


export const FromModelToVehicle = async (
    vehicle: ModelVehicle, 
    pCollection: Collection<ModelPart>
): Promise<Vehicle> => {

    const parts = await pCollection.find({_id: {$in: vehicle.parts}}).toArray()
    return {
        id: vehicle._id!.toString(),
        name: vehicle.name,
        manufacturer: vehicle.manufacturer,
        year: vehicle.year,
        parts: parts.map(v => FromModelToPart(v))
    }
}

export const FromModelToPart = ( part: ModelPart ): Part => {
    return {
            id: part._id!.toString(),
            name: part.name,
            price: part.price,
            vehicleID: part.vehicleID.toString()
    }
}


export const change = async (
    vehicle: ModelVehicle, 
    PartCollection: Collection<ModelPart>
): Promise<Vehicle> => {
    return {
        id: vehicle._id!.toString(),
        name: vehicle.name,
        manufacturer: vehicle.manufacturer,
        year: vehicle.year,
        parts: await Promise.all(vehicle.parts.map(e => getParts(e,PartCollection)))
    }
}

export const getParts = async (
    id: ObjectId,
    PartCollection: Collection<ModelPart>
): Promise<Part> => {
    const result = await PartCollection.findOne({_id:id})
    const aux:Part ={
        id: "buenas",
        name: "Buenas",
        price: 3,
        vehicleID: "asdasd"
    }
    return aux
}