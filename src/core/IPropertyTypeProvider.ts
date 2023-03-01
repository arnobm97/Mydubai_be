import { EmbededUser } from "./IUserProvider"
import { Document } from "mongoose";
import { IPropertyLang } from "./IPropertyProvider"


export interface EmbededPropertyType {
    id: string,
    name: string,
}

export interface IPropertyType extends Document{
    name: string;
    lang: IPropertyLang;
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
    getAll(lang?: IPropertyLang): Promise<IPropertyType[]>;
    list(page:number, size:number, lang?: IPropertyLang): Promise<IPropertyTypePage>;
    create(name: string, lang: IPropertyLang, createdBy: EmbededUser): Promise<IPropertyType>;
}