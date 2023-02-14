import { IStoreProvider, IStore, EmbededStore } from "../core/IStoreProvider";
import StoreModel from "../models/StoreModel";


export class StoreProvider implements IStoreProvider {

    public async getAll(): Promise<IStore[]> {
        return await StoreModel.find().catch(err => null);
    }

    public async getById(id: string): Promise<IStore> {
        return await StoreModel.findOne({"_id": id}, {'__v': 0} ).catch(err => null);
    }

    public async getByName(name: string): Promise<IStore> {
        return await StoreModel.findOne({"name": name}, {'__v': 0} ).catch(err => null);
    }

    public async create(name: string, address?: string): Promise<IStore> {
        return await StoreModel.create({
            name
        });
    }

    public async update(id: string, name: string ): Promise<any> {
        const updateData = {"name": name };
        return await StoreModel.updateOne(
            {"_id" : id},
            updateData
        );
    }

    public async delete(id: string): Promise<any> {
        return await StoreModel.findByIdAndDelete(id);
    }

}