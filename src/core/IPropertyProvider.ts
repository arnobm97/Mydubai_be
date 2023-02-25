import { EmbededUser } from "./IUserProvider"
import { Document } from "mongoose";


export enum IPropertyType {
    OFFPLAN = "OFF PLAN",
    READY = "READY"
}
export enum IPropertyLang {
    EN = "EN",
    AR = "AR"
}
export interface IPropertyArea {
    id: string;
    areaName: string;
}
export interface IDevelopmentType {
    id: string;
    name: string;
}
export interface IDeveloperType {
    id: string;
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
    lang: IPropertyLang;
    propertyNo: number;
    propertyName: string;
    propertyType: IPropertyType;
    propertyDescription: string;
    propertyArea: IPropertyArea;
    developmentType: IDevelopmentType;
    developerType: IDeveloperType;
    areaSize: string;
    highlights: string[];
    amenities: IPropertyAmenities;  // html string
    completion: string;
    startingPrice: number;
    location: IPropertyLocation;
    paymentPlan: IPaymentPlan[];
    unitType: IUnitType;
    brcure: string;
    images: IPropertyImage[];
    videos: IPropertyVideo[];
    createBy: EmbededUser;
}


export interface IPropertyPage {
    size: number,
    page: number,
    count: number,
    data: IProperty[]
}




export interface IPropertyProvider {

    getAll(): Promise<IProperty[]>;
    create(property: IProperty): Promise<IProperty>;

}