// import UserModel from "../models/UserModel";
import {ICustomerInterestProvider, ICustomerInterest, ICustomerInterestPage} from "../core/ICustomerInterestProvider";
import {EmbededProperty} from "../core/IPropertyProvider";
import CustomerInterestModel from "../models/CustomerInterestModel";


export class CustomerInterestProvider implements ICustomerInterestProvider {


    public async get(id: string): Promise<ICustomerInterest> {
        return await CustomerInterestModel.findOne({"_id": id }).catch(err => null);
    }


    public async list(page:number = 1, size:number = 10): Promise<ICustomerInterestPage> {
        let pageSize : number;
        const count: number = await CustomerInterestModel.find().countDocuments();
        let query;
        if(page === 0){
            pageSize = count;
            query = await CustomerInterestModel.find().catch(err => null);
        }else{
            pageSize = size;
            query = await CustomerInterestModel.find().skip(size * (page - 1)).limit(size).catch(err => null);
        }
        return { size: pageSize, page, count, data: query };
    }

    public async create(property: EmbededProperty, name: string, email: string, phone: string, preferedLang: string, description: string): Promise<ICustomerInterest> {
        return await CustomerInterestModel.create({
            property,
            name,
            email,
            phone,
            preferedLang,
            description
        });
    }

    public async delete(id: string): Promise<any> {
        return await CustomerInterestModel.findByIdAndDelete(id);
    }


}