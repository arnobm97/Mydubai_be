import { EmbededUser } from "./IUserProvider"
import { IPropertyLang } from "./IPropertyProvider"
import { Document } from "mongoose";


export interface EmbededPropertyArea {
    id: string,
    areaName: string,
}

export interface IPropertyArea extends Document{
    areaName: string;
    lang: IPropertyLang;
    createdBy: EmbededUser;
}

export interface IPropertyAreaPage {
    size: number,
    page: number,
    count: number,
    data: IPropertyArea[]
}


export interface IPropertyAreaProvider {
    get(id: string): Promise<IPropertyArea>;
    getAll(lang?: IPropertyLang): Promise<IPropertyArea[]>;
    list(page:number, size:number, lang?: IPropertyLang): Promise<IPropertyAreaPage>;
    create(areaName: string, lang: IPropertyLang, createdBy: EmbededUser): Promise<IPropertyArea>;
}