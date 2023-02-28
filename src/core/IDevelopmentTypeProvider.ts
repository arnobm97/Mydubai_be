import { EmbededUser } from "./IUserProvider"
import { Document } from "mongoose";


export interface EmbededDevelopmentType {
    id: string,
    name: string,
}

export interface IDevelopmentType extends Document{
    name: string;
    createdBy: EmbededUser;
}

export interface IDevelopmentTypePage {
    size: number,
    page: number,
    count: number,
    data: IDevelopmentType[]
}


export interface IDevelopmentTypeProvider {
    count(): Promise<number>;

    get(id: string): Promise<IDevelopmentType>;

    getAll(): Promise<IDevelopmentType[]>;
    
    list(page:number, size:number): Promise<IDevelopmentTypePage>;

    create(name: string, createdBy: EmbededUser): Promise<IDevelopmentType>;
}