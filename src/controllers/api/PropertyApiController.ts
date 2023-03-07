import { Controller } from "../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../core/Types";
import { IPropertyProvider, IProperty, IPropertyPage } from "../../core/IPropertyProvider";
import {IPropertyAreaProvider, IPropertyArea } from "../../core/IPropertyAreaProvider";
import {IDevelopmentTypeProvider, IDevelopmentType } from "../../core/IDevelopmentTypeProvider";
import {IPropertyTypeProvider, IPropertyType } from "../../core/IPropertyTypeProvider";
import {IDeveloperTypeProvider, IDeveloperType, IDeveloperTypePage } from "../../core/IDeveloperTypeProvider";


export class PropertyApiController extends Controller {

    private config = require("../../../config.json");
    private response = { status: 200, error: false, message: "", data: {} };
    private PropertyProvider: IPropertyProvider;
    private PropertyAreaProvider: IPropertyAreaProvider;
    private DeveloperTypeProvider: IDeveloperTypeProvider;
    private PropertyTypeProvider: IPropertyTypeProvider;
    private DevelopmentTypeProvider: IDevelopmentTypeProvider;



    public onRegister(): void {
        this.onGet("/api/v1/:lang/data/filter-list", this.filterList);
        this.onGet("/api/v1/:lang/developers", this.developerList);
        this.onGet("/api/v1/:lang/developer/:developerId", this.developerDetails);
        this.onGet("/api/v1/:lang/properties", this.propertyList);
        this.onGet("/api/v1/:lang/property/:propertyNo", this.propertyDetails);
    }
    /**
     * method: filter list
     */
    public async filterList(req: HttpRequest, res: HttpResponse, next: NextFunc) {
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
    /**
     * method: developer list
     */
    public async developerList(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        try{
            const lang: string =  req.params.lang;
            const p: any = req.query.page;
            const s: any = req.query.size;
            let page: number = parseInt(p, 10);
            if (!page || page < 0) page = 1;
            let size: number = parseInt(s, 10);
            if (!size || size < 1) size = 9;
            const developers: IDeveloperTypePage = await this.DeveloperTypeProvider.list(page, size, lang);
            const payload = {developers, lang: res.bag.lang, langList: res.bag.langList };
            this.response.message = 'success';
            this.response.data = payload;
            return res.status(200).send(this.response);
        }catch(err){
            const developers: any = null;
            const payload = {developers, lang: res.bag.lang, langList: res.bag.langList };
            this.response.message = err;
            this.response.status = 500;
            this.response.data = payload;
            return res.status(200).send(this.response);
        }
    }
    /**
     * method: developer details
     */
    public async developerDetails(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        try{
            const lang: string =  req.params.lang;
            const developerId: string =  req.params.developerId;
            //filter - act as optional
            const propertyAreaId: any =  req.query.propertyAreaId;
            const propertyTypeId: any =  req.query.propertyTypeId;
            const completion: any =  req.query.completion;
            const beds: any =  req.query.beds;

            const p: any = req.query.page;
            const s: any = req.query.size;
            let page: number = parseInt(p, 10);
            if (!page || page < 0) page = 1;
            let size: number = parseInt(s, 10);
            if (!size || size < 1) size = 6;
            const developer: IDeveloperType = await this.DeveloperTypeProvider.get(developerId)
            const developerProperty: IPropertyPage = await this.PropertyProvider.propertyListByDeveloper(page, size, developerId, propertyAreaId, propertyTypeId, completion, beds); 
            const payload = {developer, developerProperty, lang: res.bag.lang, langList: res.bag.langList };
            this.response.message = 'success';
            this.response.data = payload;
            return res.status(200).send(this.response);
        }catch(err){
            const developer: any = null;
            const developerProperty: any = null;
            const payload = {developer, developerProperty, lang: res.bag.lang, langList: res.bag.langList };
            this.response.message = err;
            this.response.status = 500;
            this.response.data = payload;
            return res.status(200).send(this.response);
        }
    }
    /**
     * method: property list
     */
    public async propertyList(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        try{
            const lang: string =  req.params.lang;
            //filter - act as optional
            const developmentTypeId: any =  req.query.developmentTypeId;
            const propertyTypeId: any =  req.query.propertyTypeId;
            const developerId: any =  req.query.developerId;
            const propertyAreaId: any =  req.query.propertyAreaId;
            const completion: any =  req.query.completion;

            const p: any = req.query.page;
            const s: any = req.query.size;
            let page: number = parseInt(p, 10);
            if (!page || page < 0) page = 1;
            let size: number = parseInt(s, 10);
            if (!size || size < 1) size = 6;
            
            const properties: IPropertyPage = await this.PropertyProvider.propertySearch(page, size, lang, developmentTypeId, propertyTypeId, developerId, propertyAreaId, completion); 
            const payload = {properties, lang: res.bag.lang, langList: res.bag.langList };
            this.response.message = 'success';
            this.response.data = payload;
            return res.status(200).send(this.response);
        }catch(err){
            const properties: any = null;
            const payload = {properties, lang: res.bag.lang, langList: res.bag.langList };
            this.response.message = err;
            this.response.status = 500;
            this.response.data = payload;
            return res.status(200).send(this.response);
        }
    }
    /**
     * method: property details
     */
    public async propertyDetails(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        try{
            const lang: any =  req.params.lang;
            const propertyNo: any =  req.params.propertyNo;
            const property: IProperty = await this.PropertyProvider.get(propertyNo,lang);
            const payload = { property, lang: res.bag.lang, langList: res.bag.langList };
            this.response.data = payload;
            return res.status(this.response.status).send(this.response);
        }catch(err){
            const property: any = null;
            const payload = { property, lang: res.bag.lang, langList: res.bag.langList };
            this.response.message = err;
            this.response.status = 500;
            this.response.data = payload;
            return res.status(this.response.status).send(this.response);
        }
    }



}