import { IVendorProvider, IVendor, EmbededVendor } from "../core/IVendorProvider";
import VendorModel from "../models/VendorModel";


export class VendorProvider implements IVendorProvider {


    public async getAll(): Promise<IVendor> {
        return await VendorModel.find().catch(err => null);
    }

    public async getLastItem(): Promise<IVendor> {
        return await VendorModel.findOne({'__v': 0}).sort('-updatedAt').catch(err => null);
    }

    public async getById(id: string): Promise<IVendor> {
        return await VendorModel.findOne({"_id": id}, {'__v': 0} ).catch(err => null);
    }

    public async getByName(name: string): Promise<IVendor> {
        return await VendorModel.findOne({"name": name}, {'__v': 0} ).catch(err => null);
    }

    public async create(name: string, address?: string): Promise<IVendor> {
        return await VendorModel.create({
            name,
            address,
        });
    }


    public async update(id: string, name: string, address?: string ): Promise<any> {
        const updateData = {"name": name, "address": address };
        return await VendorModel.updateOne(
            {"_id" : id},
            updateData
        );
    }



}