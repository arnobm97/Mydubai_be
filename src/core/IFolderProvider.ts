import { Document } from "mongoose";
import { EmbededUser } from "./IUserProvider";


export interface IFolder extends Document{
    folderName: string,
    remarks: string,
    createBy: EmbededUser;
}

export interface IFolderPage {
    size: number,
    page: number,
    count: number,
    data: IFolder[];
}

export interface IFolderProvider {
    get(id: string): Promise<IFolder>;
    list(page:number, size:number): Promise<IFolderPage>;
    create(folderName: string, remarks: string, createBy: EmbededUser): Promise<IFolder>;
    delete(id: string): Promise<any>;
}