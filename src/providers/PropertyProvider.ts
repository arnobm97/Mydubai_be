// import UserModel from "../models/UserModel";
import {IPropertyProvider, IProperty, IPropertyPage } from "../core/IPropertyProvider";
import PropertyModel from "../models/PropertyModel";


export class PropertyProvider implements IPropertyProvider {

    public async count(): Promise<number> {
        return await PropertyModel.find({ "lang": 'en' }).countDocuments();
    }

    public async lastPropertyNo(): Promise<number> {
        const lastEntry =  await PropertyModel.find().sort({propertyNo:-1}).limit(1).catch(err => null);
        if(lastEntry.length === 1){
            return lastEntry[0].propertyNo;
        }else{
            return 0;
        }
    }


    public async get(propertyNo: number, lang: string): Promise<IProperty> {
        return await PropertyModel.findOne({"propertyNo": propertyNo, "lang": lang }).catch(err => null);
    }

    public async getAll(lang?: string): Promise<IProperty[]> {
        if(lang){
            return await PropertyModel.find({ "lang": lang }).catch(err => null);
        }else{
            return await PropertyModel.find().sort( { propertyNo: 1 } ).catch(err => null);
        }
    }


    public async letestByDevelopmentType(developmentTypeId: string, limit: number): Promise<IProperty[]> {
        return await PropertyModel.find({"developmentType.id": developmentTypeId}).limit(limit).catch(err => null);
    }



    public async propertyListByDeveloper(page:number = 1, size:number = 10, developerId: string, propertyAreaId: string, propertyTypeId: string, completion: string, beds: string): Promise<IPropertyPage> {
        let filter: any = {"developerType.id": developerId };
        if(propertyAreaId) {
            filter = {...filter, "propertyArea.id": propertyAreaId};
        }
        if(propertyTypeId) {
            filter = {...filter, "propertyType.id": propertyTypeId};
        }
        if(completion) {
            filter = {...filter, "completion": completion};
        }
        if(beds) {
            filter = {...filter,  "unitType.count": beds };
        }

        let pageSize : number;
        const count: number = await PropertyModel.find(filter).countDocuments();
        let query;

        if(page === 0){
            pageSize = count;
            query = await PropertyModel.find(filter).catch(err => null);
        }else{
            pageSize = size;
            query = await PropertyModel.find(filter).skip(size * (page - 1)).limit(size).catch(err => null);
        }
        return { size: pageSize, page, count, data: query };
    }


    
    public async propertySearch(page:number, size:number, lang: string, developmentTypeId: string, propertyTypeId: string, developerId: string, propertyAreaId: string, completion: string): Promise<IPropertyPage> {
        let filter: any = {lang: lang };
        if(developmentTypeId) {
            filter = {...filter, "developmentType.id": developmentTypeId};
        }
        if(propertyTypeId) {
            filter = {...filter, "propertyType.id": propertyTypeId};
        }
        if(developerId) {
            filter = {...filter, "developerType.id": developerId};
        }
        if(propertyAreaId) {
            filter = {...filter, "propertyArea.id": propertyAreaId};
        }
        if(completion) {
            filter = {...filter, "completion": completion};
        }
        let pageSize : number;
        const count: number = await PropertyModel.find(filter).countDocuments();
        let query;
        if(page === 0){
            pageSize = count;
            query = await PropertyModel.find(filter).catch(err => null);
        }else{
            pageSize = size;
            query = await PropertyModel.find(filter).skip(size * (page - 1)).limit(size).catch(err => null);
        }
        return { size: pageSize, page, count, data: query };
    }



    public async create(property: IProperty): Promise<IProperty> {
        return await PropertyModel.create(property);
    }


    public async delete(propertyId: string): Promise<any> {
        return await PropertyModel.findByIdAndDelete(propertyId);
    }






}