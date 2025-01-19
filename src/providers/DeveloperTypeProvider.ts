
import { IDeveloperTypeProvider, IDeveloperType, IDeveloperTypePage } from "../core/IDeveloperTypeProvider";
import { EmbededUser } from "../core/IUserProvider";
import DeveloperTypeModel from "../models/DeveloperTypeModel";



export class DeveloperTypeProvider implements IDeveloperTypeProvider {

    public async count(): Promise<number> {
        return await DeveloperTypeModel.find({ "lang": 'en' }).countDocuments();
    }

    public async get(id: string): Promise<IDeveloperType> {
        return await DeveloperTypeModel.findOne({ "_id": id }).catch(null);
    }

    public async getAll(lang?: string): Promise<IDeveloperType[]> {
        if(lang){
            return await DeveloperTypeModel.find({ "lang": lang },{_id:1, name:1}).catch(null);
        }else{
            return await DeveloperTypeModel.find().catch(null);
        }
    }

    public async list(page:number = 1, size:number = 10, lang?: string): Promise<IDeveloperTypePage> {
        let filter: any = {}
        if(lang) {
            filter = {...filter, lang};
        }
        let pageSize : number;
        const count: number = await DeveloperTypeModel.find(filter).countDocuments();
        let query;
        if(page === 0){
            pageSize = count;
            query = await DeveloperTypeModel.find(filter).catch(null);
        }else{
            pageSize = size;
            query = await DeveloperTypeModel.find(filter).skip(size * (page - 1)).limit(size).catch(null);
        }
        return { size: pageSize, page, count, data: query };
    }


    public async create(name: string, description: string, logo: string, lang: string, createdBy: EmbededUser): Promise<IDeveloperType> {
        return await DeveloperTypeModel.create({
            name,
            description,
            logo,
            lang,
            createdBy
        });
    }

    public async update(developerTypeId: string, name: string, lang: string, description: string, logo: string): Promise<any> {
        return await DeveloperTypeModel.updateOne({ "_id": developerTypeId }, {name, lang, description, logo});
    }

    public async delete(developerTypeId: string): Promise<any> {
        return await DeveloperTypeModel.findByIdAndDelete(developerTypeId);
    }




}