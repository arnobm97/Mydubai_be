import { EmbededUser } from "./IUserProvider"
import { Document } from "mongoose";

export interface ISlider extends Document{
    lang: string;
    title: string;
    description1: string;
    description2: string;
    description3: string;
    targetLink: string;
    image: string;
    createdBy: EmbededUser;
}

export interface ISliderPage {
    size: number,
    page: number,
    count: number,
    data: ISlider[]
}

export interface ISliderProvider {
    count(): Promise<number>;
    get(id: string): Promise<ISlider>;
    getAll(lang?: string): Promise<ISlider[]>;
    list(page:number, size:number, lang?: string): Promise<ISliderPage>;
    create(lang: string, title: string, description1: string, description2: string, description3: string, targetLink: string, image: string, createdBy: EmbededUser): Promise<ISlider>;
    delete(id: string): Promise<any>;
}