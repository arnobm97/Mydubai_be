import { EmbededUser } from "./IUserProvider"
import { Document } from "mongoose";


export interface EmbededDeveloperType {
    id: string,
    name: string,
}

export interface IDeveloperType extends Document{
    name: string;
    createdBy: EmbededUser;
}

export interface IDeveloperTypePage {
    size: number,
    page: number,
    count: number,
    data: IDeveloperType[]
}

export interface IDeveloperTypeProvider {
    count(): Promise<number>;
    get(id: string): Promise<IDeveloperType>;
    getAll(): Promise<IDeveloperType[]>;
    list(page:number, size:number): Promise<IDeveloperTypePage>;
    create(name: string, createdBy: EmbededUser): Promise<IDeveloperType>;
}