import { Document } from "mongoose";

export interface EmbededStore {
    _id: string,
    name: string,
}

export interface IStore extends Document {
    name: string,
}

export interface IStoreProvider {
    /**
     * Get all generic categories
     */
    getAll(): Promise<IStore[]>;
    /**
     * Get a specific vendor by id
     * @param id to look for
     */
    getById(id: string): Promise<IStore>;
    getByName(name: string): Promise<IStore>;
    /**
     * Create new category
     * @param name to create for
     */
    create(name: string): Promise<IStore>;
    update(id: string, name: string): Promise<IStore>;
    delete(id: string): Promise<any>;

}