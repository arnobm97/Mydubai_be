
import { IDevelopmentTypeProvider, IDevelopmentType, IDevelopmentTypePage } from "../core/IDevelopmentTypeProvider";
import { EmbededUser } from "../core/IUserProvider";
import DevelopmentTypeModel from "../models/DevelopmentTypeModel";



export class DevelopmentTypeProvider implements IDevelopmentTypeProvider {

    public async get(id: string): Promise<IDevelopmentType> {
        return await DevelopmentTypeModel.findOne({ "_id": id }).catch(err => null);
    }

    public async getAll(lang?: string): Promise<IDevelopmentType[]> {
        if(lang){
            return await DevelopmentTypeModel.find({ "lang": lang }).catch(err => null);
        }else{
            return await DevelopmentTypeModel.find().catch(err => null);
        }
    }

    public async list(page:number = 1, size:number = 10, lang?: string): Promise<IDevelopmentTypePage> {
        let filter: any = {}
        if(lang) {
            filter = {...filter, lang};
        }
        let pageSize : number;
        const count: number = await DevelopmentTypeModel.find(filter).countDocuments();
        let query;
        if(page === 0){
            pageSize = count;
            query = await DevelopmentTypeModel.find(filter).catch(err => null);
        }else{
            pageSize = size;
            query = await DevelopmentTypeModel.find(filter).skip(size * (page - 1)).limit(size).catch(err => null);
        }
        return { size: pageSize, page, count, data: query };
    }


    public async create(name: string, lang: string, createdBy: EmbededUser): Promise<IDevelopmentType> {
        return await DevelopmentTypeModel.create({
            name,
            lang,
            createdBy
        });
    }




}