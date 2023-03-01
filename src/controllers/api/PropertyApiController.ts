import { Controller } from "../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../core/Types";
import { IPropertyProvider, IProperty, IPropertyLang, IPropertyType } from "../../core/IPropertyProvider";
import {IPropertyAreaProvider, EmbededPropertyArea, IPropertyArea } from "../../core/IPropertyAreaProvider";
import {IDevelopmentTypeProvider, EmbededDevelopmentType, IDevelopmentType } from "../../core/IDevelopmentTypeProvider";
import {IDeveloperTypeProvider, EmbededDeveloperType, IDeveloperType } from "../../core/IDeveloperTypeProvider";


export class PropertyApiController extends Controller {

    private config = require("../../../config.json");
    private response = { status: 200, error: false, message: "", data: {} };
    private PropertyProvider: IPropertyProvider;
    private PropertyAreaProvider: IPropertyAreaProvider;
    private DevelopmentTypeProvider: IDevelopmentTypeProvider;
    private DeveloperTypeProvider: IDeveloperTypeProvider;

    public onRegister(): void {
        this.onGet("/api/v1/:lang/properties", this.index);
        this.onGet("/api/v1/:lang/property/:propertyNo", this.propertyDetails);
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
        const bag = { property: property, lang: res.bag.lang, langList: res.bag.langList };
        this.response.data = bag;
        return res.status(this.response.status).send(this.response);
    }



}