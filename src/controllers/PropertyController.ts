import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Role } from "../core/IUserProvider";
import { IPropertyProvider, IProperty, IPropertyLang, IPropertyType } from "../core/IPropertyProvider";
import {IPropertyAreaProvider, EmbededPropertyArea, IPropertyArea } from "../core/IPropertyAreaProvider";
import {IDevelopmentTypeProvider, EmbededDevelopmentType, IDevelopmentType } from "../core/IDevelopmentTypeProvider";
import {IDeveloperTypeProvider, EmbededDeveloperType, IDeveloperType } from "../core/IDeveloperTypeProvider";



export class PropertyController extends Controller {

    private config = require("../../config.json");
    private PropertyProvider: IPropertyProvider;
    private PropertyAreaProvider: IPropertyAreaProvider;
    private DevelopmentTypeProvider: IDevelopmentTypeProvider;
    private DeveloperTypeProvider: IDeveloperTypeProvider;

    public onRegister(): void {
        this.onGet("/properties", this.index, [Role.Admin, Role.Moderator]);
        this.onGet("/properties/create", this.createProperty, [Role.Admin, Role.Moderator]);
        this.onPost("/properties/create", this.createProperty, [Role.Admin, Role.Moderator]);
    }


    public async index(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Properties";
        const properties: IProperty[] = await this.PropertyProvider.getAll(IPropertyLang.EN);
        res.bag.properties = properties;
        res.bag.flashMessage = req.flash('flashMessage');
        res.view('property/index');
    }



    public async createProperty(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Property Create";
        if(req.method === "GET"){
            res.bag.language = [{title: "English", value : "en"},{title: "Arabic", value : "ar"}];
            res.bag.propertyType = [{title: "OFF PLAN", value : "OFF PLAN"},{title: "READY", value : "READY"}];
            res.bag.propertyArea = await this.PropertyAreaProvider.getAll();
            res.bag.developmentType = await this.DevelopmentTypeProvider.getAll();
            res.bag.developerType = await this.DeveloperTypeProvider.getAll();
            return res.view('property/create');
        }

        const propertyNo = 1;
        const lang = req.body.lang;
        const propertyName = req.body.propertyName;
        const propertyType = req.body.propertyType;
        const propertyDescription = req.body.propertyDescription;
        const areaSize = req.body.areaSize;
        const completion = req.body.completion;
        const highlights = req.body.highlights;  // highlights #
        const amenities = req.body.amenities; // features #
        const startingPrice = req.body.startingPrice;
        const location = req.body.location;
        const paymentPlan = req.body.paymentPlan;
        const unitType = req.body.unitType;
        const brochure = req.body.brochure;
        const images = req.body.images;
        const videos = req.body.videos;
        const createBy = { id: req.user.id, fullName: req.user.name };

        //find in db then generate object
        let tempPropertyArea: IPropertyArea = await this.PropertyAreaProvider.get(req.body.propertyArea);
        let propertyArea: EmbededPropertyArea = {id: null, areaName: null};
        if(tempPropertyArea){
            propertyArea.id = tempPropertyArea._id;
            propertyArea.areaName = tempPropertyArea.areaName;
        }else{
            req.flash('flashMessage', 'Invalid property area. Please try again.');
            return res.redirect('/properties');
        }
        let tempDevelopmentType: IDevelopmentType = await this.DevelopmentTypeProvider.get(req.body.developmentType);
        let developmentType: EmbededDevelopmentType = {id: null, name: null};
        if(tempDevelopmentType){
            developmentType.id = tempDevelopmentType._id;
            developmentType.name = tempDevelopmentType.name;
        }else{
            req.flash('flashMessage', 'Invalid development type. Please try again.');
            return res.redirect('/properties');
        }
        let tempDeveloperType: IDeveloperType = await this.DeveloperTypeProvider.get(req.body.developerType);
        let developerType: EmbededDeveloperType = {id: null, name: null};
        if(tempDeveloperType){
            developerType.id = tempDeveloperType._id;
            developerType.name = tempDeveloperType.name;
        }else{
            req.flash('flashMessage', 'Invalid developer type. Please try again.');
            return res.redirect('/properties');
        }
        const newProperty: any = {propertyNo,lang,propertyName,propertyType,propertyDescription,propertyArea,developmentType,developerType,areaSize,highlights,amenities,completion,startingPrice,location,paymentPlan,unitType,brochure,images,videos,createBy};
        
        //return res.send(newProperty);

        await this.PropertyProvider.create(newProperty).then(async property => {
            res.bag.successMessage = "Done";
            req.flash('flashMessage', 'Property created successfully.');
            return res.redirect('/properties');
        }).catch(async error => {
            req.flash('flashMessage', 'Opps! Something went wrong. Please try later.');
            return res.redirect('/properties');
        });


    }





}