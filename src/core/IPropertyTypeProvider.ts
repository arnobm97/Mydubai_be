import { EmbededUser } from "./IUserProvider"
import { Document } from "mongoose";


export interface EmbededPropertyType {
    id: string,
    name: string,
}

export interface IPropertyType extends Document{
    name: string;
    lang: string;
    createdBy: EmbededUser;
}

export interface IPropertyTypePage {
    size: number,
    page: number,
    count: number,
    data: IPropertyType[]
}

export interface IPropertyTypeProvider {
    get(id: string): Promise<IPropertyType>;
    getAll(lang?: string): Promise<IPropertyType[]>;
    list(page:number, size:number, lang?: string): Promise<IPropertyTypePage>;
    create(name: string, lang: string, createdBy: EmbededUser): Promise<IPropertyType>;
}