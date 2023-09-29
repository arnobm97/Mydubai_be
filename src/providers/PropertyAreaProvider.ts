
import { IPropertyAreaProvider, IPropertyArea, IPropertyAreaPage } from "../core/IPropertyAreaProvider";
import { EmbededUser } from "../core/IUserProvider";
import PropertyAreaModel from "../models/PropertyAreaModel";



export class PropertyAreaProvider implements IPropertyAreaProvider {

    public async count(): Promise<number> {
        return await PropertyAreaModel.find({ "lang": 'en' }).countDocuments();
    }

    public async get(id: string): Promise<IPropertyArea> {
        return await PropertyAreaModel.findOne({ "_id": id }).catch(err => null);
    }

    public async getAll(lang?: string): Promise<IPropertyArea[]> {
        if(lang){
            return await PropertyAreaModel.find({ "lang": lang },{_id:1, areaName:1}).catch(err => null);
        }else{
            return await PropertyAreaModel.find().catch(err => null);
        }
    }



    public async list(page:number = 1, size:number = 10, lang?: string): Promise<IPropertyAreaPage> {
        let filter: any = {}
        if(lang) {
            filter = {...filter, lang};
        }
        let pageSize : number;
        const count: number = await PropertyAreaModel.find(filter).countDocuments();
        let query;
        if(page === 0){
            pageSize = count;
            query = await PropertyAreaModel.find(filter).catch(err => null);
        }else{
            pageSize = size;
            query = await PropertyAreaModel.find(filter).skip(size * (page - 1)).limit(size).catch(err => null);
        }
        return { size: pageSize, page, count, data: query };
    }



    public async create(areaName: string, lang: string, areaDescription: string, areaThumbnail: string, createdBy: EmbededUser): Promise<IPropertyArea> {
        return await PropertyAreaModel.create({
            areaName,
            lang,
            areaDescription,
            areaThumbnail,
            createdBy
        });
    }




}