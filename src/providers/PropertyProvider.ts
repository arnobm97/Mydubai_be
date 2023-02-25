// import UserModel from "../models/UserModel";
import {IPropertyProvider, IProperty, IPropertyPage } from "../core/IPropertyProvider";
import PropertyModel from "../models/PropertyModel";


export class PropertyProvider implements IPropertyProvider {



    public async getAll(): Promise<IProperty[]> {
        return await PropertyModel.find().catch(err => null);
    }



    public async create(property: IProperty): Promise<IProperty> {
        return await PropertyModel.create(property);
    }






}