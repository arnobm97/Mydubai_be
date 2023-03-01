
import { IPropertyTypeProvider, IPropertyType, IPropertyTypePage } from "../core/IPropertyTypeProvider";
import { EmbededUser } from "../core/IUserProvider";
import PropertyTypeModel from "../models/PropertyTypeModel";



export class PropertyTypeProvider implements IPropertyTypeProvider {

    public async get(id: string): Promise<IPropertyType> {
        return await PropertyTypeModel.findOne({ "_id": id }).catch(err => null);
    }

    public async getAll(lang?: string): Promise<IPropertyType[]> {
        if(lang){
            return await PropertyTypeModel.find({ "lang": lang }).catch(err => null);
        }else{
            return await PropertyTypeModel.find().catch(err => null);
        }
    }

    public async list(page:number = 1, size:number = 10, lang?: string): Promise<IPropertyTypePage> {
        let filter: any = {}
        if(lang) {
            filter = {...filter, lang};
        }
        let pageSize : number;
        const count: number = await PropertyTypeModel.find(filter).countDocuments();
        let query;
        if(page === 0){
            pageSize = count;
            query = await PropertyTypeModel.find(filter).catch(err => null);
        }else{
            pageSize = size;
            query = await PropertyTypeModel.find(filter).skip(size * (page - 1)).limit(size).catch(err => null);
        }
        return { size: pageSize, page, count, data: query };
    }


    public async create(name: string, lang: string, createdBy: EmbededUser): Promise<IPropertyType> {
        return await PropertyTypeModel.create({
            name,
            lang,
            createdBy
        });
    }




}