// import UserModel from "../models/UserModel";
import {IPropertyProvider, IProperty, IPropertyPage } from "../core/IPropertyProvider";
import PropertyModel from "../models/PropertyModel";


export class PropertyProvider implements IPropertyProvider {

    public async count(): Promise<number> {
        return await PropertyModel.find({ "lang": 'en' }).countDocuments();
    }

    public async lastPropertyNo(): Promise<number> {
        const lastEntry =  await PropertyModel.find().sort({propertyNo:-1}).limit(1).catch(null);
        if(lastEntry.length === 1){
            return lastEntry[0].propertyNo;
        }else{
            return 0;
        }
    }


    public async get(propertyNo: number, lang: string): Promise<IProperty> {
        return await PropertyModel.findOne({"propertyNo": propertyNo, "lang": lang }).catch(null);
    }


    public async getById(propertyId: string): Promise<IProperty> {
        return await PropertyModel.findById(propertyId).catch(null);
    }


    public async getAll(lang?: string): Promise<IProperty[]> {
        if(lang){
            return await PropertyModel.find({ "lang": lang }).catch(null);
        }else{
            return await PropertyModel.find().sort( { propertyNo: 1 } ).catch(null);
        }
    }

// In your PropertyProvider class
public async letestByDevelopmentType(developmentTypeId: string, limit: number): Promise<IProperty[]> {
    try {
        const result = await PropertyModel.aggregate([
            {
                $match: {
                    'developmentType.id': developmentTypeId
                }
            },
            { $sort: { createdAt: -1 } },
            { $limit: limit },

            // Lookup developer type using STRING ID comparison
            {
                $lookup: {
                    from: 'developer-types', // Your collection name
                    let: { devId: "$developerType.id" }, // This is a string like "emaar"
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$devId"] // Compare _id (string) with devId (string)
                                    // OR if your developer collection uses string _id like "emaar"
                                    // this should work
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                logo: 1,
                                description: 1,
                                _id: 1
                            }
                        }
                    ],
                    as: 'developerTypeInfo'
                }
            },

            // Lookup property type using STRING ID comparison
            {
                $lookup: {
                    from: 'property-types',
                    let: { propTypeId: "$propertyType.id" }, // String like "apt"
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$propTypeId"] // String comparison
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                thumbnail: 1,
                                description: 1,
                                _id: 1
                            }
                        }
                    ],
                    as: 'propertyTypeInfo'
                }
            },

            // Lookup development type (optional, since you might already have it)
            {
                $lookup: {
                    from: 'development-types',
                    let: { devTypeId: "$developmentType.id" }, // String like "ready"
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$devTypeId"]
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        }
                    ],
                    as: 'developmentTypeInfo'
                }
            },

            // Lookup property area using STRING ID comparison
            {
                $lookup: {
                    from: 'property-areas', // Adjust if different collection name
                    let: { areaId: "$propertyArea.id" }, // String like "dubai-marina"
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$areaId"] // String comparison
                                }
                            }
                        },
                        {
                            $project: {
                                areaName: 1,
                                name: 1,
                                _id: 1
                            }
                        }
                    ],
                    as: 'propertyAreaInfo'
                }
            },

            // Merge the looked up data
            {
                $addFields: {
                    developerType: {
                        $cond: {
                            if: { $gt: [{ $size: "$developerTypeInfo" }, 0] },
                            then: {
                                $mergeObjects: [
                                    "$developerType",
                                    { $arrayElemAt: ["$developerTypeInfo", 0] }
                                ]
                            },
                            else: "$developerType"
                        }
                    },
                    propertyType: {
                        $cond: {
                            if: { $gt: [{ $size: "$propertyTypeInfo" }, 0] },
                            then: {
                                $mergeObjects: [
                                    "$propertyType",
                                    { $arrayElemAt: ["$propertyTypeInfo", 0] }
                                ]
                            },
                            else: "$propertyType"
                        }
                    },
                    developmentType: {
                        $cond: {
                            if: { $gt: [{ $size: "$developmentTypeInfo" }, 0] },
                            then: {
                                $mergeObjects: [
                                    "$developmentType",
                                    { $arrayElemAt: ["$developmentTypeInfo", 0] }
                                ]
                            },
                            else: "$developmentType"
                        }
                    },
                    propertyArea: {
                        $cond: {
                            if: { $gt: [{ $size: "$propertyAreaInfo" }, 0] },
                            then: {
                                $mergeObjects: [
                                    "$propertyArea",
                                    { $arrayElemAt: ["$propertyAreaInfo", 0] }
                                ]
                            },
                            else: "$propertyArea"
                        }
                    }
                }
            },

            // Clean up
            {
                $project: {
                    developerTypeInfo: 0,
                    propertyTypeInfo: 0,
                    developmentTypeInfo: 0,
                    propertyAreaInfo: 0
                }
            }
        ]);

        return result;
    } catch (error) {
        console.error('Error in letestByDevelopmentType:', error);
        throw error;
    }
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
            query = await PropertyModel.find(filter).catch(null);
        }else{
            pageSize = size;
            query = await PropertyModel.find(filter).skip(size * (page - 1)).limit(size).catch(null);
        }
        return { size: pageSize, page, count, data: query };
    }


    public async propertyListByArea(page:number, size:number, propertyAreaId: string, developerId: string, propertyTypeId: string, completion: string, beds: string): Promise<IPropertyPage> {
        let filter: any = {"propertyArea.id": propertyAreaId };
        if(developerId) {
            filter = {...filter, "developerType.id": developerId};
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
            query = await PropertyModel.find(filter).catch(null);
        }else{
            pageSize = size;
            query = await PropertyModel.find(filter).skip(size * (page - 1)).limit(size).catch(null);
        }
        return { size: pageSize, page, count, data: query };
    }

    public async propertyListByPropertyType(page:number, size:number, propertyTypeId: string, developerId: string, propertyAreaId: string, completion: string, beds: string): Promise<IPropertyPage> {
        let filter: any = {"propertyType.id": propertyTypeId };
        if(developerId) {
            filter = {...filter, "developerType.id": developerId};
        }
        if(propertyAreaId) {
            filter = {...filter, "propertyArea.id": propertyAreaId};
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
            query = await PropertyModel.find(filter).catch(null);
        }else{
            pageSize = size;
            query = await PropertyModel.find(filter).skip(size * (page - 1)).limit(size).catch(null);
        }
        return { size: pageSize, page, count, data: query };
    }



    public async propertySearch(page:number, size:number, lang: string, developmentTypeId: string, propertyTypeId: string, developerId: string, propertyAreaId: string, completion: string): Promise<IPropertyPage> {
        let filter: any = {lang };
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
            query = await PropertyModel.find(filter).catch(null);
        }else{
            pageSize = size;
            query = await PropertyModel.find(filter).skip(size * (page - 1)).limit(size).catch(null);
        }
        return { size: pageSize, page, count, data: query };
    }



    public async create(property: IProperty): Promise<IProperty> {
        return await PropertyModel.create(property);
    }


    public async updatePropertyByRefData(condition: object, updateData: object): Promise<any> {
        return await PropertyModel.updateMany(condition, updateData);
    }


    public async delete(propertyId: string): Promise<any> {
        return await PropertyModel.findByIdAndDelete(propertyId);
    }






}