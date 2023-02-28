
import { IDeveloperTypeProvider, IDeveloperType, IDeveloperTypePage } from "../core/IDeveloperTypeProvider";
import { EmbededUser } from "../core/IUserProvider";
import DeveloperTypeModel from "../models/DeveloperTypeModel";
import { IPropertyLang } from "../core/IPropertyProvider";



export class DeveloperTypeProvider implements IDeveloperTypeProvider {

    public async get(id: string): Promise<IDeveloperType> {
        return await DeveloperTypeModel.findOne({ "_id": id }).catch(err => null);
    }

    public async getAll(lang?: IPropertyLang): Promise<IDeveloperType[]> {
        if(lang){
            return await DeveloperTypeModel.find({ "lang": lang }).catch(err => null);
        }else{
            return await DeveloperTypeModel.find().catch(err => null);
        }
    }

    public async list(page:number = 1, size:number = 10, lang?: IPropertyLang): Promise<IDeveloperTypePage> {
        let filter: any = {}
        if(lang) {
            filter = {...filter, lang};
        }
        let pageSize : number;
        const count: number = await DeveloperTypeModel.find(filter).countDocuments();
        let query;
        if(page === 0){
            pageSize = count;
            query = await DeveloperTypeModel.find(filter).catch(err => null);
        }else{
            pageSize = size;
            query = await DeveloperTypeModel.find(filter).skip(size * (page - 1)).limit(size).catch(err => null);
        }
        return { size: pageSize, page, count, data: query };
    }


    public async create(name: string, lang: IPropertyLang, createdBy: EmbededUser): Promise<IDeveloperType> {
        return await DeveloperTypeModel.create({
            name,
            lang,
            createdBy
        });
    }




}