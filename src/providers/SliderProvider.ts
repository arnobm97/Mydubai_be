
import { ISliderProvider, ISlider, ISliderPage } from "../core/ISliderProvider";
import { EmbededUser } from "../core/IUserProvider";
import SliderModel from "../models/SliderModel";



export class SliderProvider implements ISliderProvider {

    public async count(): Promise<number> {
        return await SliderModel.find({ "lang": 'en' }).countDocuments();
    }

    public async get(id: string): Promise<ISlider> {
        return await SliderModel.findOne({ "_id": id }).catch(null);
    }

    public async getAll(lang?: string): Promise<ISlider[]> {
        if(lang){
            return await SliderModel.find({ "lang": lang },{createdBy:0, __v:0}).catch(null);
        }else{
            return await SliderModel.find().catch(null);
        }
    }

    public async list(page:number = 1, size:number = 10, lang?: string): Promise<ISliderPage> {
        let filter: any = {}
        if(lang) {
            filter = {...filter, lang};
        }
        let pageSize : number;
        const count: number = await SliderModel.find(filter).countDocuments();
        let query;
        if(page === 0){
            pageSize = count;
            query = await SliderModel.find(filter).catch(null);
        }else{
            pageSize = size;
            query = await SliderModel.find(filter).skip(size * (page - 1)).limit(size).catch(null);
        }
        return { size: pageSize, page, count, data: query };
    }


    public async create(lang: string, title: string, description1: string, description2: string, description3: string, targetLink: string, image: string, createdBy: EmbededUser): Promise<ISlider> {
        return await SliderModel.create({
            lang,
            title,
            description1,
            description2,
            description3,
            targetLink,
            image,
            createdBy
        });
    }


    public async delete(id: string): Promise<any> {
        return await SliderModel.findByIdAndDelete(id).catch(null);
    }




}