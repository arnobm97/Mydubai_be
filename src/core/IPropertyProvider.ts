import { EmbededUser } from "./IUserProvider";
import {EmbededPropertyType } from "../core/IPropertyTypeProvider";
import {EmbededPropertyArea } from "../core/IPropertyAreaProvider";
import {EmbededDevelopmentType } from "../core/IDevelopmentTypeProvider";
import {EmbededDeveloperType } from "../core/IDeveloperTypeProvider";
import { Document } from "mongoose";

export interface EmbededProperty {
    propertyNo: number;
    name: string;
}

export interface IPropertyAmenities {
    description: string;
    features: string[];
}
export interface IPropertyImage {
    type: string;
    metaDescription: string;
    path: string;
}
export interface IPropertyVideo {
    type: string;
    path: string;
}
export interface IPropertyNearBy {
    title: string;
    icon: string;
    position: [number,number];
}
export interface IPropertyLocation {
    locDescription: string;
    position: [number,number];
    nearby: IPropertyNearBy[];
}
export interface IPaymentPlan {
    milestone: string;
    installment: number;
    percentage: string;
    date: Date;
    notes: string;
}
export interface IUnitType {
    title: string;
    count: string;
    size: string;
}

export interface IProperty extends Document{
    propertyNo: number;
    lang: string;
    propertyName: string;
    propertyDescription: string;
    propertyType: EmbededPropertyType;
    propertyArea: EmbededPropertyArea;
    developmentType: EmbededDevelopmentType;
    developerType: EmbededDeveloperType;
    areaSize: string;
    highlights: string[];
    amenities: IPropertyAmenities;  // html string
    completion: string;
    startingPrice: number;
    location: IPropertyLocation;
    paymentPlan: IPaymentPlan[];
    unitType: IUnitType;
    brochure: string;
    images: IPropertyImage[];
    videos: IPropertyVideo[];
    isFeatured: boolean;
    createBy: EmbededUser;
}

export interface IPropertyPage {
    size: number,
    page: number,
    count: number,
    data: IProperty[]
}


export interface IPropertyProvider {
    count(): Promise<number>;
    get(propertyNo: number, lang: string): Promise<IProperty>;
    getAll(lang?: string): Promise<IProperty[]>;
    letestByDevelopmentType(developmentTypeId: string, limit: number): Promise<IProperty[]>;
    lastPropertyNo(): Promise<number>;
    propertyListByDeveloper(page:number, size:number, developerId: string, propertyAreaId: string, propertyTypeId: string, completion: string, beds: string): Promise<IPropertyPage>;
    propertySearch(page:number, size:number, lang: string, developmentTypeId: string, propertyTypeId: string, developerId: string, propertyAreaId: string, completion: string): Promise<IPropertyPage>;
    create(property: IProperty): Promise<IProperty>;

}