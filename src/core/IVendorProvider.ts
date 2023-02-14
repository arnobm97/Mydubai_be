import { Document } from "mongoose";

export interface EmbededVendor {
    _id: string,
    name: string,
    address: string
}

export interface IVendor extends Document {
    name: string,
    address?: string,
}

export interface IVendorProvider {
    /**
     * Get all generic categories
     */
    getAll(): Promise<IVendor>;



    getLastItem(): Promise<IVendor>;

    /**
     * Get a specific vendor by id
     * @param id to look for
     */
    getById(id: string): Promise<IVendor>;


    getByName(name: string): Promise<IVendor>;

    /**
     * Create new category
     * @param name to create for
     * @param address to create for
     */
    create(name: string, address?: string ): Promise<IVendor>;


    update(id: string, name: string, address?: string ): Promise<IVendor>;





}