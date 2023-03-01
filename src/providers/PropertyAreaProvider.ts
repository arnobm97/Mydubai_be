
import { IPropertyAreaProvider, IPropertyArea, IPropertyAreaPage } from "../core/IPropertyAreaProvider";
import { EmbededUser } from "../core/IUserProvider";
import { IPropertyLang } from "../core/IPropertyProvider";
import PropertyAreaModel from "../models/PropertyAreaModel";



export class PropertyAreaProvider implements IPropertyAreaProvider {

    public async get(id: string): Promise<IPropertyArea> {
        return await PropertyAreaModel.findOne({ "_id": id }).catch(err => null);
    }

    public async getAll(lang?: IPropertyLang): Promise<IPropertyArea[]> {
        if(lang){
            return await PropertyAreaModel.find({ "lang": lang }).catch(err => null);
        }else{
            return await PropertyAreaModel.find().catch(err => null);
        }
    }



    public async list(page:number = 1, size:number = 10, lang?: IPropertyLang): Promise<IPropertyAreaPage> {
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



    public async create(areaName: string, lang: IPropertyLang, createdBy: EmbededUser): Promise<IPropertyArea> {
        return await PropertyAreaModel.create({
            areaName,
            lang,
            createdBy
        });
    }




}