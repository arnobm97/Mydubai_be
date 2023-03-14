import { EmbededUser } from "./IUserProvider"
import { Document } from "mongoose";


export interface EmbededDeveloperType {
    id: string,
    name: string,
}

export interface IDeveloperType extends Document{
    name: string;
    description: string;
    lang: string;
    logo: string;
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
    getAll(lang?: string): Promise<IDeveloperType[]>;
    list(page:number, size:number, lang?: string): Promise<IDeveloperTypePage>;
    create(name: string, description: string, logo: string, lang: string, createdBy: EmbededUser): Promise<IDeveloperType>;
}