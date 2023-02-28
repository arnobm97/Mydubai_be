
import { IDevelopmentTypeProvider, IDevelopmentType, IDevelopmentTypePage } from "../core/IDevelopmentTypeProvider";
import { EmbededUser } from "../core/IUserProvider";
import DevelopmentTypeModel from "../models/DevelopmentTypeModel";



export class DevelopmentTypeProvider implements IDevelopmentTypeProvider {

    public async count(): Promise<number> {
        return await DevelopmentTypeModel.find().countDocuments();
    }

    public async get(id: string): Promise<IDevelopmentType> {
        return await DevelopmentTypeModel.findOne({ "_id": id }).catch(err => null);
    }

    public async getAll(): Promise<IDevelopmentType[]> {
        return await DevelopmentTypeModel.find().catch(err => null);
    }

    public async list(page:number = 1, size:number = 10): Promise<IDevelopmentTypePage> {
        let pageSize : number;
        const count: number = await DevelopmentTypeModel.find().countDocuments();
        let query;
        if(page === 0){
            pageSize = count;
            query = await DevelopmentTypeModel.find().catch(err => null);
        }else{
            pageSize = size;
            query = await DevelopmentTypeModel.find().skip(size * (page - 1)).limit(size).catch(err => null);
        }
        return { size: pageSize, page, count, data: query };
    }


    public async create(name: string, createdBy: EmbededUser): Promise<IDevelopmentType> {
        return await DevelopmentTypeModel.create({
            name,
            createdBy
        });
    }




}