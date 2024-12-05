import { ModelPart, ModelVehicle, Part, Vehicle } from "./types.ts";
import { Collection, ObjectId } from "mongodb";

export const change = async (
    vehicle: ModelVehicle, 
    PartCollection: Collection<ModelPart>
): Promise<Vehicle> => {
    return {
        id: vehicle._id!.toString(),
        name: vehicle.name,
        manufacturer: vehicle.manufacturer,
        year: vehicle.year,
        joke: await getJoke(),
        parts: await Promise.all(vehicle.parts.map(e => getParts(e,PartCollection)))
    }
}

export const getParts = async (
    id: ObjectId,
    PartCollection: Collection<ModelPart>
): Promise<Part> => {
    console.log(id)
    const result = await PartCollection.findOne({_id:id})
    return ({
        id: result!._id.toString(),
        name: result!.name,
        price: result!.price,
        vehicleId: result!.vehicleId.toString()
    })
}

export const FromModelToPart = (part: ModelPart): Part => {
    return {
        id: part._id!.toString(),
        name: part.name,
        price: part.price,
        vehicleId: part.vehicleId.toString()
    }
}

export const getJoke = async():Promise<string> => {
    const response = await fetch("https://official-joke-api.appspot.com/random_joke")
    const joke = await response.json()
    return joke.setup + " " +joke.punchline
}