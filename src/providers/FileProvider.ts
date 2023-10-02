// import UserModel from "../models/UserModel";
import {IFileProvider, IFile} from "../core/IFileProvider";
import {EmbededUser} from "../core/IUserProvider";
import FileModel  from "../models/FileModel";


export class FileProvider implements IFileProvider {

    public async get(id: string): Promise<IFile> {
        return await FileModel.findOne({"_id": id }).catch(err => null);
    }

    public async getByFolderId(folderId: string): Promise<IFile[]> {
        return await FileModel.find({"folderId": folderId }).catch(err => null);
    }

    public async create(folderId: string, location: string, fileName: string, createBy: EmbededUser): Promise<IFile> {
        return await FileModel.create({
            folderId,
            location,
            fileName,
            createBy
        });
    }
    
    public async delete(id: string): Promise<any> {
        return await FileModel.findByIdAndDelete(id);
    }

}