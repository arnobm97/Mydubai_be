import { IProductProvider, IProduct, EmbededProduct } from "../core/IProductProvider";
import ProductModel from "../models/ProductModel";


export class ProductProvider implements IProductProvider {


    public async getAll(): Promise<IProduct> {
        return await ProductModel.find().catch(err => null);
    }


    public async getLastItem(): Promise<IProduct> {
        return await ProductModel.findOne({'__v': 0}).sort('-updatedAt').catch(err => null);
    }

    public async getById(id: string): Promise<IProduct> {
        return await ProductModel.findOne({"_id": id}, {'__v': 0} ).catch(err => null);
    }

    public async getByName(name: string): Promise<IProduct> {
        return await ProductModel.findOne({"name": name}, {'__v': 0} ).catch(err => null);
    }

    public async create(name: string, unit: string): Promise<IProduct> {
        return await ProductModel.create({
            name,
            unit
        });
    }



}