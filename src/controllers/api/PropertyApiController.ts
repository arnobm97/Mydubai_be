import { Controller } from "../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../core/Types";
import { IPropertyProvider, IProperty } from "../../core/IPropertyProvider";
import {IPropertyAreaProvider, IPropertyArea } from "../../core/IPropertyAreaProvider";
import {IDevelopmentTypeProvider, IDevelopmentType } from "../../core/IDevelopmentTypeProvider";
import {IPropertyTypeProvider, IPropertyType } from "../../core/IPropertyTypeProvider";
import {IDeveloperTypeProvider, IDeveloperType } from "../../core/IDeveloperTypeProvider";


export class PropertyApiController extends Controller {

    private config = require("../../../config.json");
    private response = { status: 200, error: false, message: "", data: {} };
    private PropertyProvider: IPropertyProvider;
    private PropertyAreaProvider: IPropertyAreaProvider;
    private DeveloperTypeProvider: IDeveloperTypeProvider;
    private PropertyTypeProvider: IPropertyTypeProvider;
    private DevelopmentTypeProvider: IDevelopmentTypeProvider;



    public onRegister(): void {
        this.onGet("/api/v1/:lang/properties", this.index);
        this.onGet("/api/v1/:lang/property/:propertyNo", this.propertyDetails);
        // filterList
        this.onGet("/api/v1/:lang/data/filter-list", this.filterList);
    }


    /**
     * method: filter list
     */
    public async filterList(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        try{
            const lang: any =  req.params.lang;
            const propertyAreas: IPropertyArea[] = await this.PropertyAreaProvider.getAll(lang);
            const developers: IDeveloperType[] = await this.DeveloperTypeProvider.getAll(lang);
            const propertyTypes: IPropertyType[] = await this.PropertyTypeProvider.getAll(lang);
            const completions = [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030];
            const developmentTypes: IDevelopmentType[] = await this.DevelopmentTypeProvider.getAll(lang);
            const payload = {propertyAreas, developers, propertyTypes, completions, developmentTypes, lang: res.bag.lang, langList: res.bag.langList };
            this.response.message = 'success';
            this.response.data = payload;
            return res.status(200).send(this.response);
        }catch(err){
            this.response.message = err;
            this.response.status = 500;
            this.response.data = null;
            return res.status(200).send(this.response);
        }
    }






    public async index(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        const lang: any =  req.params.lang;
        const properties: IProperty[] = await this.PropertyProvider.getAll(lang);
        if(!properties){
            this.response.message = "Properties not found.";
        }else{
            this.response.message = "Properties found.";
        }
        const bag = { properties };
        this.response.data = bag;
        return res.status(this.response.status).send(this.response)
    }



    public async propertyDetails(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        const lang: any =  req.params.lang;
        const propertyNo: any =  req.params.propertyNo;
        const property: IProperty = await this.PropertyProvider.get(propertyNo,lang);
        if(!property){
            this.response.message = "Property not found.";
        }else{
            this.response.message = "Property found.";
        }
        const bag = { property, lang: res.bag.lang, langList: res.bag.langList };
        this.response.data = bag;
        return res.status(this.response.status).send(this.response);
    }



}