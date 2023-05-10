import { Controller } from "../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../core/Types";
import { IPropertyProvider, IProperty, IPropertyPage } from "../../core/IPropertyProvider";
import {IPropertyAreaProvider, IPropertyArea } from "../../core/IPropertyAreaProvider";
import {IDevelopmentTypeProvider, IDevelopmentType } from "../../core/IDevelopmentTypeProvider";
import {IPropertyTypeProvider, IPropertyType } from "../../core/IPropertyTypeProvider";
import {IDeveloperTypeProvider, IDeveloperType, IDeveloperTypePage } from "../../core/IDeveloperTypeProvider";


export class HomeApiController extends Controller {

    private config = require("../../../config.json");
    private response = { status: 200, error: false, message: "", data: {} };
    private PropertyProvider: IPropertyProvider;
    private PropertyAreaProvider: IPropertyAreaProvider;
    private DeveloperTypeProvider: IDeveloperTypeProvider;
    private PropertyTypeProvider: IPropertyTypeProvider;
    private DevelopmentTypeProvider: IDevelopmentTypeProvider;



    public onRegister(): void {
        this.onGet("/api/v1/:lang/home", this.home);
    }
    


    public async home(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        try{
            const lang: string =  req.params.lang;
            const propertyAreas: IPropertyArea[] = await this.PropertyAreaProvider.getAll(lang);
            const developers: IDeveloperType[] = await this.DeveloperTypeProvider.getAll(lang);
            const propertyTypes: IPropertyType[] = await this.PropertyTypeProvider.getAll(lang);
            const developmentTypes: IDevelopmentType[] = await this.DevelopmentTypeProvider.getAll(lang);
            const completions = [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030];
            const payload = {propertyAreas, developers, propertyTypes, completions, developmentTypes, lang: res.bag.lang, langList: res.bag.langList };
            this.response.message = 'success';
            this.response.data = payload;
            return res.status(200).send(this.response);
        }catch(err){
            const propertyAreas: any = null;
            const developers: any = null;
            const propertyTypes: any = null;
            const developmentTypes: any = null;
            const completions: any = null;
            const payload = {propertyAreas, developers, propertyTypes, completions, developmentTypes, lang: res.bag.lang, langList: res.bag.langList };
            this.response.message = err;
            this.response.status = 500;
            this.response.data = payload;
            return res.status(200).send(this.response);
        }
    }
  


}