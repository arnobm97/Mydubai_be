import { EmbededUser } from "./IUserProvider"
import { Document } from "mongoose";
import { IPropertyLang } from "./IPropertyProvider"


export interface EmbededDevelopmentType {
    id: string,
    name: string,
}

export interface IDevelopmentType extends Document{
    name: string;
    lang: IPropertyLang;
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
    getAll(lang?: IPropertyLang): Promise<IDevelopmentType[]>;
    list(page:number, size:number, lang?: IPropertyLang): Promise<IDevelopmentTypePage>;
    create(name: string, lang: IPropertyLang, createdBy: EmbededUser): Promise<IDevelopmentType>;
}