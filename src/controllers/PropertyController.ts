import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Role } from "../core/IUserProvider";
import { IPropertyProvider, IProperty } from "../core/IPropertyProvider";
import {IPropertyTypeProvider, IPropertyType, EmbededPropertyType } from "../core/IPropertyTypeProvider";
import {IPropertyAreaProvider, EmbededPropertyArea, IPropertyArea } from "../core/IPropertyAreaProvider";
import {IDevelopmentTypeProvider, EmbededDevelopmentType, IDevelopmentType } from "../core/IDevelopmentTypeProvider";
import {IDeveloperTypeProvider, EmbededDeveloperType, IDeveloperType } from "../core/IDeveloperTypeProvider";

export class PropertyController extends Controller {

    private config = require(`../../${(process.env.NODE_ENV || 'development') === 'production' ? "config.prod.json" : "config.dev.json"}`);
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

    // index
    public async index(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Properties";
        const queryLanguage: any = req.query.lang;
        const properties: IProperty[] = await this.PropertyProvider.getAll(queryLanguage);
        res.bag.properties = properties;
        res.bag.currentLang = queryLanguage;
        res.bag.flashMessage = req.flash('flashMessage');
        res.view('property/index');
    }

    // Helper method to convert ObjectId to string
    private toEmbeddedType<T extends { _id: any, name: string }>(
        item: T | null, 
        idFieldName: string = '_id'
    ): { id: string | null, name: string | null } {
        if (!item) {
            return { id: null, name: null };
        }
        return {
            id: item[idFieldName]?.toString() || null,
            name: item.name
        };
    }

    // Helper method for PropertyArea (has areaName instead of name)
    private toEmbeddedPropertyArea(item: IPropertyArea | null): EmbededPropertyArea {
        if (!item) {
            return { id: null, areaName: null };
        }
        return {
            id: item._id?.toString() || null,
            areaName: item.areaName
        };
    }

    // create
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
        const highlights = req.body.highlights;
        const tag = req.body.tag;
        const amenities = req.body.amenities;
        const startingPrice = req.body.startingPrice;
        const location = req.body.location;
        const paymentPlan = req.body.paymentPlan;
        const unitType = req.body.unitType;
        const brochure = req.body.brochure;
        const images = req.body.images;
        const videos = req.body.videos;
        const isFeatured = true;
        const createBy = { id: req.user.id, fullName: req.user.name };

        // Get and convert embedded types
        const tempPropertyType: IPropertyType = await this.PropertyTypeProvider.get(req.body.propertyType);
        const propertyType: EmbededPropertyType = this.toEmbeddedType(tempPropertyType);
        
        if(!propertyType.id){
            req.flash('flashMessage', 'Invalid property type. Please try again.');
            return res.redirect('/properties');
        }

        const tempPropertyArea: IPropertyArea = await this.PropertyAreaProvider.get(req.body.propertyArea);
        const propertyArea: EmbededPropertyArea = this.toEmbeddedPropertyArea(tempPropertyArea);
        
        if(!propertyArea.id){
            req.flash('flashMessage', 'Invalid property area. Please try again.');
            return res.redirect('/properties');
        }

        const tempDevelopmentType: IDevelopmentType = await this.DevelopmentTypeProvider.get(req.body.developmentType);
        const developmentType: EmbededDevelopmentType = this.toEmbeddedType(tempDevelopmentType);
        
        if(!developmentType.id){
            req.flash('flashMessage', 'Invalid development type. Please try again.');
            return res.redirect('/properties');
        }

        const tempDeveloperType: IDeveloperType = await this.DeveloperTypeProvider.get(req.body.developerType);
        const developerType: EmbededDeveloperType = this.toEmbeddedType(tempDeveloperType);
        
        if(!developerType.id){
            req.flash('flashMessage', 'Invalid developer type. Please try again.');
            return res.redirect('/properties');
        }

        const newProperty: any = {
            propertyNo,
            lang,
            propertyName,
            propertyDescription,
            propertyType,
            propertyArea,
            developmentType,
            developerType,
            areaSize,
            highlights,
            tag,
            amenities,
            completion,
            startingPrice,
            location,
            paymentPlan,
            unitType,
            brochure,
            images,
            videos,
            isFeatured,
            createBy
        };

        await this.PropertyProvider.create(newProperty).then(async property => {
            req.flash('flashMessage', 'Property created successfully.');
            return res.redirect('/properties');
        }).catch(async error => {
            console.error('Error creating property:', error);
            req.flash('flashMessage', 'Oops! Something went wrong. Please try later.');
            return res.redirect('/properties');
        });
    }

    // update
    public async updateProperty(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Property Update";
        const propertyId: string = req.params.propertyId;
        
        if(req.method === "GET"){
            try{
                const property: IProperty = await this.PropertyProvider.getById(propertyId);
                res.bag.property = property;
                res.bag.propertyType = await this.PropertyTypeProvider.getAll();
                res.bag.propertyArea = await this.PropertyAreaProvider.getAll();
                res.bag.developmentType = await this.DevelopmentTypeProvider.getAll();
                res.bag.developerType = await this.DeveloperTypeProvider.getAll();
                return res.view('property/update');
            }catch(error){
                console.error('Error fetching property for update:', error);
                req.flash('flashMessage', 'Oops! Something went wrong. Please try later.');
                return res.redirect('/properties');
            }
        }else{
            try{
                const lang = req.body.lang;
                const propertyName = req.body.propertyName;
                const propertyDescription = req.body.propertyDescription;
                const areaSize = req.body.areaSize;
                const completion = req.body.completion;
                const highlights = req.body.highlights;
                const tag = req.body.tag;
                const amenities = req.body.amenities;
                const startingPrice = req.body.startingPrice;
                const location = req.body.location;
                const paymentPlan = req.body.paymentPlan;
                const unitType = req.body.unitType;
                const brochure = req.body.brochure;
                const images = req.body.images;
                const videos = req.body.videos;

                // Get and convert embedded types
                const tempPropertyType: IPropertyType = await this.PropertyTypeProvider.get(req.body.propertyType);
                const propertyType: EmbededPropertyType = this.toEmbeddedType(tempPropertyType);
                
                if(!propertyType.id){
                    req.flash('flashMessage', 'Invalid property type. Please try again.');
                    return res.redirect('/properties');
                }

                const tempPropertyArea: IPropertyArea = await this.PropertyAreaProvider.get(req.body.propertyArea);
                const propertyArea: EmbededPropertyArea = this.toEmbeddedPropertyArea(tempPropertyArea);
                
                if(!propertyArea.id){
                    req.flash('flashMessage', 'Invalid property area. Please try again.');
                    return res.redirect('/properties');
                }

                const tempDevelopmentType: IDevelopmentType = await this.DevelopmentTypeProvider.get(req.body.developmentType);
                const developmentType: EmbededDevelopmentType = this.toEmbeddedType(tempDevelopmentType);
                
                if(!developmentType.id){
                    req.flash('flashMessage', 'Invalid development type. Please try again.');
                    return res.redirect('/properties');
                }

                const tempDeveloperType: IDeveloperType = await this.DeveloperTypeProvider.get(req.body.developerType);
                const developerType: EmbededDeveloperType = this.toEmbeddedType(tempDeveloperType);
                
                if(!developerType.id){
                    req.flash('flashMessage', 'Invalid developer type. Please try again.');
                    return res.redirect('/properties');
                }

                const oldProperty: IProperty = await this.PropertyProvider.getById(propertyId);
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
                oldProperty.tag = tag;
                oldProperty.completion = completion;
                oldProperty.startingPrice = startingPrice;
                oldProperty.paymentPlan = paymentPlan;
                oldProperty.brochure = brochure;
                oldProperty.images = images;
                oldProperty.videos = videos;
                
                await oldProperty.save();
                req.flash('flashMessage', 'Property updated successfully.');
                return res.redirect('/properties');
            }catch(error){
                console.error('Error updating property:', error);
                req.flash('flashMessage', 'Oops! Something went wrong. Please try later.');
                return res.redirect('/properties');
            }
        }
    }

    // delete
    public async deleteProperty(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        try{
            const propertyId = req.params.propertyId;
            await this.PropertyProvider.delete(propertyId);
            req.flash('flashMessage', 'Property deleted successfully.');
            return res.redirect('/properties');
        }catch(error){
            console.error('Error deleting property:', error);
            req.flash('flashMessage', 'Oops! Something went wrong. Please try later.');
            return res.redirect('/properties');
        }
    }
}