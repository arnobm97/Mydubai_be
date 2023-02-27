import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Role } from "../core/IUserProvider";
import { IPropertyProvider, IProperty, IPropertyLang, IPropertyType } from "../core/IPropertyProvider";
import { any } from "bluebird";



export class PropertyController extends Controller {

    private config = require("../../config.json");
    private PropertyProvider: IPropertyProvider;

    public onRegister(): void {
        this.onGet("/properties", this.index, [Role.Admin, Role.Moderator]);
        this.onGet("/properties/create", this.createProperty, [Role.Admin, Role.Moderator]);
        this.onPost("/properties/create", this.createProperty, [Role.Admin, Role.Moderator]);
    }


    public async index(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Properties";
        const properties: IProperty[] = await this.PropertyProvider.getAll();
        res.bag.properties = properties;
        res.bag.flashMessage = req.flash('flashMessage');
        //return res.send(properties);
        res.view('property/index');
    }



    public async createProperty(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Property Create";

        if(req.method === "GET"){
            res.bag.language = [{title: "English", value : "EN"},{title: "Arabic", value : "AR"}];
            res.bag.propertyType = [{title: "OFF PLAN", value : "OFF PLAN"},{title: "READY", value : "READY"}];
            res.bag.propertyArea = [{_id: "112345", areaName : "Dubai"},{_id: "112421", areaName : "Sharjah"},{_id: "112499", areaName : "Abu Dhabi"}];
            res.bag.developmentType = [{_id: "112345", name : "D Type 1"},{_id: "112421", name : "D Type 2"},{_id: "112499", name : "D Type 3"}];
            res.bag.developerType = [{_id: "112345", name : "DP Type 1"},{_id: "112421", name : "DP Type 2"},{_id: "112499", name : "DP Type 3"}];
            return res.view('property/create');
        }

        const propertyNo = 1;
        const lang = req.body.lang;
        const propertyName = req.body.propertyName;
        const propertyType = req.body.propertyType;
        const propertyDescription = req.body.propertyDescription;

        const propertyArea = {
            id: req.body.propertyArea,
            areaName: "Dubai"
        };
        const developmentType = {
            id: req.body.developmentType,
            name: "TDP1"
        };
        const developerType = {
            id: req.body.developerType,
            name: "TD1"
        };

        const areaSize = req.body.areaSize;
        const completion = req.body.completion;
        const highlights = req.body.highlights;  //highlights #
        const amenities = req.body.amenities; //features #
        const startingPrice = req.body.startingPrice;
        let location = req.body.location;
        const paymentPlan = req.body.paymentPlan;
        const unitType = req.body.unitType;
        const brochure = req.body.brochure;
        const images = req.body.images;
        const videos = req.body.videos;
        const createBy = { id: req.user.id, fullName: req.user.name };


        //location parsing
        const tempLocation = [];
        for(let i = 0; i<location.position.split(',').length; i++) {
            tempLocation[i] = parseFloat(location.position.split(',')[i])
        }
        location.position = tempLocation;
        
        //nearBy position parsing
        const tempNearby = location.nearby;
        for(let i = 0; i<tempNearby.length; i++) {
            let tempPoint = [];
            for(let j = 0; j<tempNearby[i].position.split(',').length; j++) {
                tempPoint[j] =  parseFloat(tempNearby[i].position.split(',')[j]);
            }
            location.nearby[i].position = tempPoint;
        }

        const testproperty: any = {
            propertyNo: propertyNo,
            lang: lang,
            propertyName: propertyName,
            propertyType: propertyType,
            propertyDescription: propertyDescription,
            propertyArea: propertyArea,
            developmentType: developmentType,
            developerType: developerType,
            areaSize: areaSize,
            highlights: highlights,
            amenities: amenities,
            completion: completion,
            startingPrice: startingPrice,
            location: location,
            paymentPlan:paymentPlan,
            unitType : unitType,
            brochure: brochure,
            images: images,
            videos: videos,
            createBy: createBy
        };

        //return res.send(testproperty);
        await this.PropertyProvider.create(testproperty).then(async property => {
            res.bag.successMessage = "Done";
            req.flash('flashMessage', 'Property created successfully.');
            res.redirect('/properties');
        }).catch(async error => {
            req.flash('flashMessage', 'Opps! Something went wrong. Please try later.');
            res.redirect('/properties');
        });


    }





}