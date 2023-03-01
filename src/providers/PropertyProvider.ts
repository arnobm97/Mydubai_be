// import UserModel from "../models/UserModel";
import {IPropertyProvider, IProperty, IPropertyPage } from "../core/IPropertyProvider";
import PropertyModel from "../models/PropertyModel";


export class PropertyProvider implements IPropertyProvider {



    public async lastPropertyNo(): Promise<number> {
        const lastEntry =  await PropertyModel.find().sort({propertyNo:-1}).limit(1).catch(err => null);
        if(lastEntry.length == 1){
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

    public async create(property: IProperty): Promise<IProperty> {
        return await PropertyModel.create(property);
    }






}