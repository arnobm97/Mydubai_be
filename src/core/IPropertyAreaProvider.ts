import { EmbededUser } from "./IUserProvider"
import { Document } from "mongoose";


export interface EmbededPropertyArea {
    id: string,
    areaName: string,
}

export interface IPropertyArea extends Document{
    areaName: string;
    lang: string;
    createdBy: EmbededUser;
}

export interface IPropertyAreaPage {
    size: number,
    page: number,
    count: number,
    data: IPropertyArea[]
}


export interface IPropertyAreaProvider {
    count(): Promise<number>;
    get(id: string): Promise<IPropertyArea>;
    getAll(lang?: string): Promise<IPropertyArea[]>;
    list(page:number, size:number, lang?: string): Promise<IPropertyAreaPage>;
    create(areaName: string, lang: string, createdBy: EmbededUser): Promise<IPropertyArea>;
}