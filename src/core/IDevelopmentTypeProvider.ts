import { EmbededUser } from "./IUserProvider"
import { Document } from "mongoose";


export interface EmbededDevelopmentType {
    id: string,
    name: string,
}

export interface IDevelopmentType extends Document{
    name: string;
    lang: string;
    createdBy: EmbededUser;
}

export interface IDevelopmentTypePage {
    size: number,
    page: number,
    count: number,
    data: IDevelopmentType[]
}


export interface IDevelopmentTypeProvider {
    get(id: string): Promise<IDevelopmentType>;
    getAll(lang?: string): Promise<IDevelopmentType[]>;
    list(page:number, size:number, lang?: string): Promise<IDevelopmentTypePage>;
    create(name: string, lang: string, createdBy: EmbededUser): Promise<IDevelopmentType>;
}