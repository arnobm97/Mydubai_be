import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Role } from "../core/IUserProvider";
import { IPropertyProvider, IProperty } from "../core/IPropertyProvider";
import {IPropertyTypeProvider, IPropertyType, EmbededPropertyType } from "../core/IPropertyTypeProvider";
import {IPropertyAreaProvider, EmbededPropertyArea, IPropertyArea } from "../core/IPropertyAreaProvider";
import {IDevelopmentTypeProvider, EmbededDevelopmentType, IDevelopmentType } from "../core/IDevelopmentTypeProvider";
import {IDeveloperTypeProvider, EmbededDeveloperType, IDeveloperType } from "../core/IDeveloperTypeProvider";



export class PropertyController extends Controller {

    private config = require("../../config.json");
    private PropertyProvider: IPropertyProvider;
    private PropertyTypeProvider: IPropertyTypeProvider;
    private PropertyAreaProvider: IPropertyAreaProvider;
    private DevelopmentTypeProvider: IDevelopmentTypeProvider;
    private DeveloperTypeProvider: IDeveloperTypeProvider;

    public onRegister(): void {
        this.onGet("/properties", this.index, [Role.Admin, Role.Moderator]);
        this.onGet("/properties/create/:propertyNo?", this.createProperty, [Role.Admin, Role.Moderator]);
        this.onPost("/properties/create/:propertyNo?", this.createProperty, [Role.Admin, Role.Moderator]);
        this.onGet("/properties/update/:propertyId?", this.updateProperty, [Role.Admin, Role.Moderator]);
        this.onPost("/properties/update/:propertyId?", this.updateProperty, [Role.Admin, Role.Moderator]);
        this.onGet("/properties/delete/:propertyId?", this.deleteProperty, [Role.Admin]);
    }

    //index
    public async index(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Properties";
        const queryLanguage: any = req.query.lang;
        const properties: IProperty[] = await this.PropertyProvider.getAll(queryLanguage);
        res.bag.properties = properties;
        res.bag.currentLang = queryLanguage;
        res.bag.flashMessage = req.flash('flashMessage');
        res.view('property/index');
    }


    //create
    public async createProperty(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Property Create";
        const queryLanguage: any = req.query.language;

        if(req.method === "GET"){
            res.bag.propertyType = await this.PropertyTypeProvider.getAll(queryLanguage);
            res.bag.propertyArea = await this.PropertyAreaProvider.getAll(queryLanguage);
            res.bag.developmentType = await this.DevelopmentTypeProvider.getAll(queryLanguage);
            res.bag.developerType = await this.DeveloperTypeProvider.getAll(queryLanguage);
            return res.view('property/create');
        }
        let propertyNo: number;
        if(req.params.propertyNo){
            propertyNo = parseInt(req.params.propertyNo,10);
        }else{
            const lastPropertyNo = await this.PropertyProvider.lastPropertyNo();
            propertyNo = lastPropertyNo+1;
        }

        const lang = req.body.lang;
        const propertyName = req.body.propertyName;
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
        const isFeatured = true;
        const createBy = { id: req.user.id, fullName: req.user.name };

        // find in db then generate object
        const tempPropertyType: IPropertyType =  await this.PropertyTypeProvider.get(req.body.propertyType);
        const propertyType: EmbededPropertyType = {id: null, name: null};
        if(tempPropertyType){
            propertyType.id = tempPropertyType._id;
            propertyType.name = tempPropertyType.name;
        }else{
            req.flash('flashMessage', 'Invalid property type. Please try again.');
            return res.redirect('/properties');
        }
        const tempPropertyArea: IPropertyArea = await this.PropertyAreaProvider.get(req.body.propertyArea);
        const propertyArea: EmbededPropertyArea = {id: null, areaName: null};
        if(tempPropertyArea){
            propertyArea.id = tempPropertyArea._id;
            propertyArea.areaName = tempPropertyArea.areaName;
        }else{
            req.flash('flashMessage', 'Invalid property area. Please try again.');
            return res.redirect('/properties');
        }
        const tempDevelopmentType: IDevelopmentType = await this.DevelopmentTypeProvider.get(req.body.developmentType);
        const developmentType: EmbededDevelopmentType = {id: null, name: null};
        if(tempDevelopmentType){
            developmentType.id = tempDevelopmentType._id;
            developmentType.name = tempDevelopmentType.name;
        }else{
            req.flash('flashMessage', 'Invalid development type. Please try again.');
            return res.redirect('/properties');
        }
        const tempDeveloperType: IDeveloperType = await this.DeveloperTypeProvider.get(req.body.developerType);
        const developerType: EmbededDeveloperType = {id: null, name: null};
        if(tempDeveloperType){
            developerType.id = tempDeveloperType._id;
            developerType.name = tempDeveloperType.name;
        }else{
            req.flash('flashMessage', 'Invalid developer type. Please try again.');
            return res.redirect('/properties');
        }
        const newProperty: any = {propertyNo,lang,propertyName,propertyDescription,propertyType,propertyArea,developmentType,developerType,areaSize,highlights,amenities,completion,startingPrice,location,paymentPlan,unitType,brochure,images,videos,isFeatured,createBy};

        // return res.send(newProperty);

        await this.PropertyProvider.create(newProperty).then(async property => {
            res.bag.successMessage = "Done";
            req.flash('flashMessage', 'Property created successfully.');
            return res.redirect('/properties');
        }).catch(async error => {
            req.flash('flashMessage', 'Opps! Something went wrong. Please try later.');
            return res.redirect('/properties');
        });


    }

    //update
    public async updateProperty(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Property Update";
        const propertyId: string = req.params.propertyId;
        if(req.method === "GET"){
            try{ 
                const property: IProperty = await this.PropertyProvider.getById(propertyId);
                const lang: string = property.lang;
                res.bag.property = property;
                res.bag.propertyType = await this.PropertyTypeProvider.getAll();
                res.bag.propertyArea = await this.PropertyAreaProvider.getAll();
                res.bag.developmentType = await this.DevelopmentTypeProvider.getAll();
                res.bag.developerType = await this.DeveloperTypeProvider.getAll();
                return res.view('property/update');
            }catch(error){
                console.log(error);
                req.flash('flashMessage', 'Opps! Something went wrong. Please try later.');
                return res.redirect('/properties');
            }
        }else{
            try{
                const lang = req.body.lang;
                const propertyName = req.body.propertyName;
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
                //const isFeatured = true;
                //const createBy = { id: req.user.id, fullName: req.user.name };
        
                // find in db then generate object
                const tempPropertyType: IPropertyType =  await this.PropertyTypeProvider.get(req.body.propertyType);
                const propertyType: EmbededPropertyType = {id: null, name: null};
                if(tempPropertyType){
                    propertyType.id = tempPropertyType._id;
                    propertyType.name = tempPropertyType.name;
                }else{
                    req.flash('flashMessage', 'Invalid property type. Please try again.');
                    return res.redirect('/properties');
                }
                const tempPropertyArea: IPropertyArea = await this.PropertyAreaProvider.get(req.body.propertyArea);
                const propertyArea: EmbededPropertyArea = {id: null, areaName: null};
                if(tempPropertyArea){
                    propertyArea.id = tempPropertyArea._id;
                    propertyArea.areaName = tempPropertyArea.areaName;
                }else{
                    req.flash('flashMessage', 'Invalid property area. Please try again.');
                    return res.redirect('/properties');
                }
                const tempDevelopmentType: IDevelopmentType = await this.DevelopmentTypeProvider.get(req.body.developmentType);
                const developmentType: EmbededDevelopmentType = {id: null, name: null};
                if(tempDevelopmentType){
                    developmentType.id = tempDevelopmentType._id;
                    developmentType.name = tempDevelopmentType.name;
                }else{
                    req.flash('flashMessage', 'Invalid development type. Please try again.');
                    return res.redirect('/properties');
                }
                const tempDeveloperType: IDeveloperType = await this.DeveloperTypeProvider.get(req.body.developerType);
                const developerType: EmbededDeveloperType = {id: null, name: null};
                if(tempDeveloperType){
                    developerType.id = tempDeveloperType._id;
                    developerType.name = tempDeveloperType.name;
                }else{
                    req.flash('flashMessage', 'Invalid developer type. Please try again.');
                    return res.redirect('/properties');
                }
                
                let oldProperty: IProperty = await this.PropertyProvider.getById(propertyId);
                oldProperty.propertyName = propertyName;
                oldProperty.lang = lang;
                oldProperty.propertyDescription = propertyDescription;
                oldProperty.areaSize = areaSize;
                oldProperty.propertyType = propertyType;
                oldProperty.propertyArea = propertyArea;
                oldProperty.developmentType = developmentType;
                oldProperty.developerType = developerType;
                oldProperty.amenities = amenities;
                oldProperty.location = location;
                oldProperty.unitType = unitType;
                oldProperty.highlights = highlights;
                oldProperty.completion = completion;
                oldProperty.startingPrice = startingPrice;
                oldProperty.paymentPlan = paymentPlan;
                oldProperty.brochure = brochure;
                oldProperty.images = images;
                oldProperty.videos = videos;
                oldProperty.save();
                req.flash('flashMessage', 'Property updated successfully.');
                return res.redirect('/properties');
            }catch(error){
                req.flash('flashMessage', 'Opps! Something went wrong. Please try later.');
                return res.redirect('/properties');
            }
        }
    }


    //delete
    public async deleteProperty(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        try{
            const propertyId = req.params.propertyId;
            await this.PropertyProvider.delete(propertyId);
            res.bag.successMessage = "Done";
            req.flash('flashMessage', 'Property deleted successfully.');
            return res.redirect('/properties');
        }catch(error){
            //console.log(error);
            req.flash('flashMessage', 'Opps! Something went wrong. Please try later.');
            return res.redirect('/properties');
        }
    }





}