import { ICategoryProvider, ICategory, EmbededAncestor } from "../core/ICategoryProvider";
import CategoryModel from "../models/CategoryModel";


export class CategoryProvider implements ICategoryProvider {


    public async getAll(): Promise<ICategory> {
        return await CategoryModel.find().catch(err => null);
    }

    public async getById(catId: string): Promise<ICategory> {
        return await CategoryModel.findOne({"_id": catId}, {'createdAt':0 , "updatedAt": 0, "__v": 0} ).catch(err => null);
    }

    public async create(name: string, slug: string, parent?: string): Promise<ICategory> {
        return await CategoryModel.create({
            name,
            slug,
            parent
        });
    }



}