import { EmbededProperty } from "./IPropertyProvider";
import { Document } from "mongoose";

export interface ICustomerInterest extends Document{
    property: EmbededProperty;
    name: string;
    email: string;
    phone: string;
    preferedLang: string;
    description: string;
}

export interface ICustomerInterestPage {
    size: number,
    page: number,
    count: number,
    data: ICustomerInterest[]
}


export interface ICustomerInterestProvider {
    get(id: string): Promise<ICustomerInterest>;
    list(page:number, size:number): Promise<ICustomerInterestPage>;
    create(property: EmbededProperty, name: string,email: string,phone: string,preferedLang: string,description: string): Promise<ICustomerInterest>;
    delete(id: string): Promise<any>;
}