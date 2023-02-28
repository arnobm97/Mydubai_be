
import { IDeveloperTypeProvider, IDeveloperType, IDeveloperTypePage } from "../core/IDeveloperTypeProvider";
import { EmbededUser } from "../core/IUserProvider";
import DeveloperTypeModel from "../models/DeveloperTypeModel";



export class DeveloperTypeProvider implements IDeveloperTypeProvider {

    public async count(): Promise<number> {
        return await DeveloperTypeModel.find().countDocuments();
    }

    public async get(id: string): Promise<IDeveloperType> {
        return await DeveloperTypeModel.findOne({ "_id": id }).catch(err => null);
    }

    public async getAll(): Promise<IDeveloperType[]> {
        return await DeveloperTypeModel.find().catch(err => null);
    }

    public async list(page:number = 1, size:number = 10): Promise<IDeveloperTypePage> {
        let pageSize : number;
        const count: number = await DeveloperTypeModel.find().countDocuments();
        let query;
        if(page === 0){
            pageSize = count;
            query = await DeveloperTypeModel.find().catch(err => null);
        }else{
            pageSize = size;
            query = await DeveloperTypeModel.find().skip(size * (page - 1)).limit(size).catch(err => null);
        }
        return { size: pageSize, page, count, data: query };
    }


    public async create(name: string, createdBy: EmbededUser): Promise<IDeveloperType> {
        return await DeveloperTypeModel.create({
            name,
            createdBy
        });
    }




}