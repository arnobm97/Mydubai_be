import { EmbededUser, IUser } from "./IUserProvider"
import { Document } from "mongoose";

export interface IParty {
    id: string;
    name: string;
    address: string;
}

export interface IProduct {
    id: string;
    name: string;
    quantity: number;
    unit: string;
}

export enum IChallanTypes {
    Incoming = "Incoming",
    Outgoing = "Outgoing"
}

export enum IWeightUnits {
    Kg = "Kg",
    Tonne = "Tonne"
}

export interface IChallan {
    /**
     * For incoming challan, party is vendor and GMS is the client.
     * For outgoing challan, party is client and GMS is the vendor.
     */
    party: IParty;
    section: string;
    tare: string;
    challanNo: string;
    lCNo: string;
    challanType: IChallanTypes;
    products: IProduct[];
}


export interface IWeightData {
    // Serialises to ISO 8601 date format.
    time: Date;
    weight: number;
    unit: IWeightUnits;
    challan: IChallan;
    user: EmbededUser;
    updatedBy: EmbededUser;
}


export interface IVehicleWeightData extends Document{
    serialNo: string;
    vehicleNo: string;
    driverName: string,
    stationId: string;
    weightData: IWeightData[];
    flag: number;
}


export interface IVehicleWeightDataPage {
    size: number,
    page: number,
    count: number,
    data: IVehicleWeightData[]
}




export interface IWeightDataProvider {

    count(): Promise<number>;


    todayCount(): Promise<number>;

    /**
     * Get all weight data by station id
     * @param stationId to look for
     */

    getAll(stationId: string): Promise<IVehicleWeightData>;

    weightDataReport(page?: number, size?: number, stationId?: string, vehicleNo?: string, vendorId?: any, challanNo?: string, productId?: string, fromDate?: string, toDate?: string, storeList?: any): Promise<IVehicleWeightDataPage>;

    getLastItem(stationId: string): Promise<IVehicleWeightData>;

    /**
     * Get a specific weight data by id
     * @param id to look for
     */
    getById(id: string): Promise<IVehicleWeightData>;
    /**
     * To create an new record
     * @param serialNo to create for
     * @param vehicleNo to create for
     * @param stationId to create for
     * @param weightData to create for
     */
    create(serialNo: string, vehicleNo: string, driverName: string, stationId: string, weightData: IWeightData[], flag?: number): Promise<IVehicleWeightData>;


    update(id: string, serialNo: string, vehicleNo: string, stationId: string, driverName: string, weightData: IWeightData[], flag?: number): Promise<IVehicleWeightData>;


    /**
     * To delete a record
     * @param id to create for
     */
     deleteById(id: string): Promise<any>;


     updateRefVendor(vendorId: string, vendorName: string, vendorAddress: string): Promise<any>;




}