import { Document } from "mongoose";
import { EmbededUser } from "./IUserProvider";


export interface IFile extends Document{
    folderId: string,
    location: string,
    fileName: string,
    createBy: EmbededUser;
}

export interface IFilePage {
    size: number,
    page: number,
    count: number,
    data: IFile[];
}

export interface IFileProvider {
    get(id: string): Promise<IFile>;
    getByFolderId(folderId: string): Promise<IFile[]>;
    create(folderId: string, location: string, fileName: string, createBy: EmbededUser): Promise<IFile>;
    delete(id: string): Promise<any>;
}