import { Document } from "mongoose";

export interface EmbededProduct {
    _id: string,
    name: string,
    quantity: number,
    unit: string
}

export interface IProduct extends Document {
    name: string,
    unit: string,
}

export interface IProductProvider {
    /**
     * Get all generic categories
     */
    getAll(): Promise<IProduct>;



    getLastItem(): Promise<IProduct>;

    /**
     * Get a specific vendor by id
     * @param id to look for
     */
    getById(id: string): Promise<IProduct>;


    getByName(name: string): Promise<IProduct>;

    /**
     * Create new category
     * @param name to create for
     * @param quantity to create for
     * @param unit to create for
     */
    create( name: string, unit: string ): Promise<IProduct>;





}