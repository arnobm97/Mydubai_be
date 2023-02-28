
import { IPropertyAreaProvider, IPropertyArea, IPropertyAreaPage } from "../core/IPropertyAreaProvider";
import { EmbededUser } from "../core/IUserProvider";
import PropertyAreaModel from "../models/PropertyAreaModel";



export class PropertyAreaProvider implements IPropertyAreaProvider {

    public async count(): Promise<number> {
        return await PropertyAreaModel.find().countDocuments();
    }

    public async get(id: string): Promise<IPropertyArea> {
        return await PropertyAreaModel.findOne({ "_id": id }).catch(err => null);
    }

    public async getAll(): Promise<IPropertyArea[]> {
        return await PropertyAreaModel.find().catch(err => null);
    }

    public async list(page:number = 1, size:number = 10): Promise<IPropertyAreaPage> {
        let pageSize : number;
        const count: number = await PropertyAreaModel.find().countDocuments();
        let query;
        if(page === 0){
            pageSize = count;
            query = await PropertyAreaModel.find().catch(err => null);
        }else{
            pageSize = size;
            query = await PropertyAreaModel.find().skip(size * (page - 1)).limit(size).catch(err => null);
        }
        return { size: pageSize, page, count, data: query };
    }


    public async create(areaName: string, createdBy: EmbededUser): Promise<IPropertyArea> {
        return await PropertyAreaModel.create({
            areaName,
            createdBy
        });
    }




}