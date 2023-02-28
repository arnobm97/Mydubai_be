// import UserModel from "../models/UserModel";
import {IPropertyProvider, IProperty, IPropertyPage, IPropertyLang } from "../core/IPropertyProvider";
import PropertyModel from "../models/PropertyModel";


export class PropertyProvider implements IPropertyProvider {



    public async get(propertyNo: number, lang: IPropertyLang): Promise<IProperty> {
        return await PropertyModel.findOne({"propertyNo": propertyNo, "lang": lang }).catch(err => null);
    }

    public async getAll(lang: IPropertyLang): Promise<IProperty[]> {
        return await PropertyModel.find({ "lang": lang }).catch(err => null);
    }

    public async create(property: IProperty): Promise<IProperty> {
        return await PropertyModel.create(property);
    }






}