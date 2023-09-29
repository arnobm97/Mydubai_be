import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import {IPropertyTypeProvider, IPropertyTypePage } from "../core/IPropertyTypeProvider";
import {IPropertyAreaProvider, IPropertyAreaPage } from "../core/IPropertyAreaProvider";
import {IDevelopmentTypeProvider, IDevelopmentTypePage } from "../core/IDevelopmentTypeProvider";
import {IDeveloperTypeProvider, IDeveloperTypePage } from "../core/IDeveloperTypeProvider";
import { Role, EmbededUser } from "../core/IUserProvider";


export class BasicSetupController extends Controller {

    private PropertyTypeProvider: IPropertyTypeProvider;
    private PropertyAreaProvider: IPropertyAreaProvider;
    private DevelopmentTypeProvider: IDevelopmentTypeProvider;
    private DeveloperTypeProvider: IDeveloperTypeProvider;
    private config = require("../../config.json");


    public onRegister(): void {
        this.onGet("/basic-setup/index", this.index, [Role.Admin, Role.Moderator]);
        this.onGet("/basic-setup/property-type", this.propertyType, [Role.Admin, Role.Moderator]);
        this.onGet("/basic-setup/property-type/create", this.createPropertyType, [Role.Admin, Role.Moderator]);
        this.onPost("/basic-setup/property-type/create", this.createPropertyType, [Role.Admin, Role.Moderator]);
        this.onGet("/basic-setup/property-area", this.propertyArea, [Role.Admin, Role.Moderator]);
        this.onGet("/basic-setup/property-area/create", this.createPropertyArea, [Role.Admin, Role.Moderator]);
        this.onPost("/basic-setup/property-area/create", this.createPropertyArea, [Role.Admin, Role.Moderator]);
        this.onGet("/basic-setup/development-type", this.developmentType, [Role.Admin, Role.Moderator]);
        this.onGet("/basic-setup/development-type/create", this.createDevelopmentType, [Role.Admin, Role.Moderator]);
        this.onPost("/basic-setup/development-type/create", this.createDevelopmentType, [Role.Admin, Role.Moderator]);
        this.onGet("/basic-setup/developer-type", this.developerType, [Role.Admin, Role.Moderator]);
        this.onGet("/basic-setup/developer-type/create", this.createDeveloperType, [Role.Admin, Role.Moderator]);
        this.onPost("/basic-setup/developer-type/create", this.createDeveloperType, [Role.Admin, Role.Moderator]);
    }


    public async index(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Basic Setup"
        res.view('basic-setup/index');
    }


    public async propertyType(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Property Type"
        const queryLanguage: any = req.query.lang;
        const p: any = req.query.page;
        const s: any = req.query.size;
        let page: number = parseInt(p, 10);
        if (!page || page < 0) page = 1;
        let size: number = parseInt(s, 10);
        if (!size || size < 1) size = 15;
        const propertyTypePage: IPropertyTypePage  = await this.PropertyTypeProvider.list(page, size, queryLanguage);
        res.bag.propertyTypePage = propertyTypePage;
        res.bag.currentLang = queryLanguage;
        res.bag.flashMessage = req.flash('flashMessage');
        res.view('basic-setup/property-type/index');
    }


    public async createPropertyType(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Create Property Type";
        if(req.method === "GET"){
            res.view('basic-setup/property-type/create');
        }else if(req.method === "POST"){
            const name = req.body.name;
            const lang = req.body.lang;
            if (!name) {
                res.bag.errorMessage = "Property type name is required";
                return res.view('basic-setup/property-type/create')
            }else if (!lang) {
                res.bag.errorMessage = "Property type language is required";
                return res.view('basic-setup/property-type/create')
            }else{
                const user : EmbededUser = {id: req.user.id, fullName: req.user.name };
                await this.PropertyTypeProvider.create(name, lang, user);
                req.flash('flashMessage', 'Property type created successfully.');
                res.redirect('/basic-setup/property-type');
            }
        }else{
            res.bag.errorMessage = "Invalid Request";
            res.view('/basic-setup/property-type');
        }
    }


    public async propertyArea(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Property Area";
        const queryLanguage: any = req.query.lang;
        const p: any = req.query.page;
        const s: any = req.query.size;
        let page: number = parseInt(p, 10);
        if (!page || page < 0) page = 1;
        let size: number = parseInt(s, 10);
        if (!size || size < 1) size = 15;
        const propertyAreaPage: IPropertyAreaPage  = await this.PropertyAreaProvider.list(page, size, queryLanguage);
        res.bag.propertyAreaPage = propertyAreaPage;
        res.bag.currentLang = queryLanguage;
        res.bag.flashMessage = req.flash('flashMessage');
        res.view('basic-setup/property-area/index');
    }


    public async createPropertyArea(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Create Property Area";
        if(req.method === "GET"){
            res.view('basic-setup/property-area/create');
        }else if(req.method === "POST"){
            const areaName = req.body.areaName;
            const lang = req.body.lang;
            const areaDescription = req.body.areaDescription;
            const areaThumbnail = req.body.areaThumbnail;
            if (!areaName) {
                res.bag.errorMessage = "Property area name is required";
                return res.view('basic-setup/property-area/create')
            }
            else if (!lang) {
                res.bag.errorMessage = "Property area language is required";
                return res.view('basic-setup/property-area/create')
            }else if (!areaDescription) {
                res.bag.errorMessage = "Property area description is required";
                return res.view('basic-setup/property-area/create')
            }else if (!areaThumbnail) {
                res.bag.errorMessage = "Property area Thumbnail is required";
                return res.view('basic-setup/property-area/create')
            }else{
                const user : EmbededUser = {id: req.user.id, fullName: req.user.name };
                await this.PropertyAreaProvider.create(areaName,lang,areaDescription,areaThumbnail,user);
                req.flash('flashMessage', 'Property area created successfully.');
                res.redirect('/basic-setup/property-area');
            }
        }else{
            res.bag.errorMessage = "Invalid Request";
            res.view('/basic-setup/property-area');
        }

    }



    public async developmentType(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Development Type"
        const queryLanguage: any = req.query.lang;
        const p: any = req.query.page;
        const s: any = req.query.size;
        let page: number = parseInt(p, 10);
        if (!page || page < 0) page = 1;
        let size: number = parseInt(s, 10);
        if (!size || size < 1) size = 15;
        const developmentTypePage: IDevelopmentTypePage  = await this.DevelopmentTypeProvider.list(page, size, queryLanguage);
        res.bag.developmentTypePage = developmentTypePage;
        res.bag.currentLang = queryLanguage;
        res.bag.flashMessage = req.flash('flashMessage');
        res.view('basic-setup/development-type/index');
    }


    public async createDevelopmentType(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Create Development Type";
        if(req.method === "GET"){
            res.view('basic-setup/development-type/create');
        }else if(req.method === "POST"){
            const name = req.body.name;
            const lang = req.body.lang;
            if (!name) {
                res.bag.errorMessage = "Development type name is required";
                return res.view('basic-setup/development-type/create')
            }else if (!lang) {
                res.bag.errorMessage = "Development type language is required";
                return res.view('basic-setup/development-type/create')
            }else{
                const user : EmbededUser = {id: req.user.id, fullName: req.user.name };
                await this.DevelopmentTypeProvider.create(name, lang, user);
                req.flash('flashMessage', 'Development type created successfully.');
                res.redirect('/basic-setup/development-type');
            }
        }else{
            res.bag.errorMessage = "Invalid Request";
            res.view('/basic-setup/development-type');
        }
    }



    public async developerType(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Developer Type";
        const queryLanguage: any = req.query.lang;
        const p: any = req.query.page;
        const s: any = req.query.size;
        let page: number = parseInt(p, 10);
        if (!page || page < 0) page = 1;
        let size: number = parseInt(s, 10);
        if (!size || size < 1) size = 10;
        const developerTypePage: IDeveloperTypePage  = await this.DeveloperTypeProvider.list(page, size, queryLanguage);
        res.bag.developerTypePage = developerTypePage;
        res.bag.currentLang = queryLanguage;
        res.bag.flashMessage = req.flash('flashMessage');
        res.view('basic-setup/developer-type/index');
    }




    public async createDeveloperType(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Create Developer Type";

        if(req.method === "GET"){
            res.view('basic-setup/developer-type/create');
        }else if(req.method === "POST"){
            const name = req.body.name;
            const description = req.body.description;
            const logo = req.body.logo;
            const lang = req.body.lang;
            if (!name) {
                res.bag.errorMessage = "Developer type name is required";
                return res.view('basic-setup/developer-type/create')
            }else if (!description) {
                res.bag.errorMessage = "Developer type description is required";
                return res.view('basic-setup/developer-type/create')
            }else if (!logo) {
                res.bag.errorMessage = "Developer type logo is required";
                return res.view('basic-setup/developer-type/create')
            }else if (!lang) {
                res.bag.errorMessage = "Developer type language is required";
                return res.view('basic-setup/developer-type/create')
            }else{
                const user : EmbededUser = {id: req.user.id, fullName: req.user.name };
                await this.DeveloperTypeProvider.create(name, description, logo, lang, user);
                req.flash('flashMessage', 'Developer type created successfully.');
                res.redirect('/basic-setup/developer-type');
            }
        }else{
            res.bag.errorMessage = "Invalid Request";
            res.view('/basic-setup/developer-type');
        }

    }






}