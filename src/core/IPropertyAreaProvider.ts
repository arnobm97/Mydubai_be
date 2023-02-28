import { EmbededUser } from "./IUserProvider"
import { Document } from "mongoose";


export interface EmbededPropertyArea {
    id: string,
    areaName: string,
}

export interface IPropertyArea extends Document{
    areaName: string;
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

    getAll(): Promise<IPropertyArea[]>;
    
    list(page:number, size:number): Promise<IPropertyAreaPage>;

    create(areaName: string, createdBy: EmbededUser): Promise<IPropertyArea>;
}