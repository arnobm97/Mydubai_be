import { EmbededUser } from "./IUserProvider"
import { Document } from "mongoose";
import { IPropertyLang } from "./IPropertyProvider"


export interface EmbededDeveloperType {
    id: string,
    name: string,
}

export interface IDeveloperType extends Document{
    name: string;
    lang: IPropertyLang;
    createdBy: EmbededUser;
}

export interface IDeveloperTypePage {
    size: number,
    page: number,
    count: number,
    data: IDeveloperType[]
}

export interface IDeveloperTypeProvider {
    get(id: string): Promise<IDeveloperType>;
    getAll(lang?: IPropertyLang): Promise<IDeveloperType[]>;
    list(page:number, size:number, lang?: IPropertyLang): Promise<IDeveloperTypePage>;
    create(name: string, lang: IPropertyLang, createdBy: EmbededUser): Promise<IDeveloperType>;
}