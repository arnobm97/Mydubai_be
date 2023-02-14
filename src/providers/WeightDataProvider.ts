// import UserModel from "../models/UserModel";
import {IVehicleWeightData, IWeightData, IWeightDataProvider, IVehicleWeightDataPage } from "../core/IWeightDataProvider";
import WeightDataModel from "../models/WeightDataModel";
import { EmbededUser } from "../core/IUserProvider";


export class WeightDataProvider implements IWeightDataProvider {

    public async count(): Promise<number> {
        return await WeightDataModel.find().find().countDocuments();
    }

    public async todayCount(): Promise<number> {
        return await WeightDataModel.find( { createdAt: { $gte: new Date().setUTCHours(0,0,0,0), $lt: new Date().setUTCHours(23,59,59,999) } } ).countDocuments();
    }

    public async getAll(stationId: string): Promise<IVehicleWeightData> {
        return await WeightDataModel.find({ "stationId": stationId }, {'__v': 0}).catch(err => null);
    }

    public async weightDataReport(page:number = 1, size:number = 20, stationId?: string, vehicleNo?: string, vendorId?: any, challanNo?: string, productId?: string, fromDate?: string, toDate?: string, storeList?: any): Promise<IVehicleWeightDataPage> {
        let filter: any = {}

        if(stationId) {
            filter = {...filter, stationId};
        }
        if(vehicleNo) {
            filter = {...filter, vehicleNo: { $regex: vehicleNo, $options: 'i' }};
        }
        if(vendorId) {
            if(typeof(vendorId) === 'object'){
                filter = {...filter, "weightData.challan.party.id": { $in: vendorId }};
            }else{
                filter = {...filter, "weightData.challan.party.id": { $regex: vendorId, $options: 'i'}};
            }
        }
        if(challanNo) {
            filter = {...filter, "weightData.challan.challanNo": { $regex: challanNo, $options: 'i' }};
        }
        if(productId) {
            filter = {...filter, "weightData.challan.products.id": { $regex: productId, $options: 'i' }};
        }

        if(storeList !== null){
            filter = {...filter, weightData: {$elemMatch: {'challan.section': storeList }} };
        }

        if(fromDate && toDate) {
            filter = {...filter, 'weightData.time': { $gte: fromDate, $lte: toDate } };
        }

        let pageSize : number;
        let query: any;
        const count: number = await WeightDataModel.find(filter).countDocuments();

        if(page===0){
            pageSize = count;
            query = await WeightDataModel.find(filter).sort({serialNo:-1}).catch(err => null);
        }else{
            pageSize = size;
            query = await WeightDataModel.find(filter).sort({serialNo:-1}).skip(size * (page - 1)).limit(size).catch(err => null);
        }

        return { size: pageSize, page, count, data: query };
    }


    public async getById(id: string): Promise<IVehicleWeightData> {
        return await WeightDataModel.findOne({ "_id": id}, {'__v': 0}).catch(err => null);
    }


    public async getLastItem(stationId: string): Promise<IVehicleWeightData> {
        return await WeightDataModel.findOne({ "stationId": stationId }, {'__v': 0}).sort('-updatedAt').catch(err => null);
    }


    public async create(serialNo: string, vehicleNo: string, driverName: string, stationId: string, weightData: IWeightData[], flag: number = 0): Promise<IVehicleWeightData> {
        const isExists = await WeightDataModel.findOne({ "serialNo": serialNo }, {'__v': 0}).sort('-updatedAt').catch(err => null);
        if(isExists){
            const updateData = {"serialNo": serialNo, "vehicleNo": vehicleNo, "stationId": stationId, "driverName": driverName, "weightData": weightData, flag };
           const tt = await WeightDataModel.updateOne(
                {"serialNo" : serialNo},
                updateData
            );
            return isExists;
        }else{
            return await WeightDataModel.create({
                serialNo,
                vehicleNo,
                driverName,
                stationId,
                weightData,
                flag
            });
        }
    }


    public async update(id: string, serialNo: string, vehicleNo: string, stationId: string, driverName: string, weightData: IWeightData[], flag: number = 0): Promise<any> {
        const updateData = {"serialNo": serialNo, "vehicleNo": vehicleNo, "stationId": stationId, "driverName": driverName, "weightData": weightData, flag };
        return await WeightDataModel.updateOne(
            {"_id" : id},
            updateData
        );
    }


    public async deleteById(id: string): Promise<any> {
        return await WeightDataModel.findByIdAndDelete(id);
    }



    public async updateRefVendor(vendorId: string, vendorName: string, vendorAddress: string): Promise<any> {
        return await WeightDataModel.updateMany(
            {
                "weightData.challan.party.id": vendorId
            },
            {
                "$set": {
                    "weightData.$[wd].challan.party.name": vendorName,
                    "weightData.$[wd].challan.party.address": vendorAddress
                }
            },
            { arrayFilters: [ { "wd.challan.party.id": vendorId } ] }
        );
    }





}