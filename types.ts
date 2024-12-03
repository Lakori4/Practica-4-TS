import { ObjectId, OptionalId } from "mongodb";

export type ModelVehicle = OptionalId <{
    name: string,
    manufacturer: string,
    year: number,
    parts: ObjectId[]
}>

export type ModelPart = OptionalId <{
    name: string,
    price: number,
    vehicleID: ObjectId
}>

export type Part = {
    id: string,
    name: string,
    price: number,
    vehicleID: string
}

export type Vehicle = {
    id: string,
    name: string,
    manufacturer: string,
    year: number,
    parts: Part[]
}