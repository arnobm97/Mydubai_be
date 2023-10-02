// import UserModel from "../models/UserModel";
import {IFolderProvider, IFolder, IFolderPage} from "../core/IFolderProvider";
import {EmbededUser} from "../core/IUserProvider";
import FolderModel from "../models/FolderModel";


export class FolderProvider implements IFolderProvider {

    public async get(id: string): Promise<IFolder> {
        return await FolderModel.findOne({"_id": id }).catch(err => null);
    }

    public async list(page:number = 1, size:number = 10): Promise<IFolderPage> {
        let pageSize : number;
        const count: number = await FolderModel.find().countDocuments();
        let query;
        if(page === 0){
            pageSize = count;
            query = await FolderModel.find().catch(err => null);
        }else{
            pageSize = size;
            query = await FolderModel.find().sort({createdAt: -1}).skip(size * (page - 1)).limit(size).catch(err => null);
        }
        return { size: pageSize, page, count, data: query };
    }

    public async create(folderName: string, remarks: string, createBy: EmbededUser): Promise<IFolder> {
        return await FolderModel.create({
            folderName,
            remarks,
            createBy
        });
    }
    
    public async delete(id: string): Promise<any> {
        return await FolderModel.findByIdAndDelete(id);
    }


}