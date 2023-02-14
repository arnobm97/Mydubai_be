import { Document } from "mongoose";

export interface EmbededAncestor {
    _id: string,
    name: string,
    slug: string
}

export interface ICategory extends Document {
    name: string,
    parent?: string,
    slug: string,
    ancestors?: EmbededAncestor[]
}

export interface ICategoryProvider {
    /**
     * Get all generic categories
     */
    getAll(): Promise<ICategory>;

    /**
     * Get a specific category by _id
     * @param catId to look for
     */
    getById(catId: string): Promise<ICategory>;

    /**
     * Create new category
     * @param name to create for
     * @param slug to create for
     * @param parent to create for
     * @param ancestors to create for
     */
    create(name: string, slug: string, parent?: string ): Promise<ICategory>;





}