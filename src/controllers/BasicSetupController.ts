import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import {IPropertyAreaProvider, IPropertyAreaPage } from "../core/IPropertyAreaProvider";
import {IDevelopmentTypeProvider, IDevelopmentTypePage } from "../core/IDevelopmentTypeProvider";
import { Role, IUserPage, EmbededUser } from "../core/IUserProvider";


export class BasicSetupController extends Controller {

    private PropertyAreaProvider: IPropertyAreaProvider;
    private DevelopmentTypeProvider: IDevelopmentTypeProvider;
    private config = require("../../config.json");


    public onRegister(): void {
        this.onGet("/basic-setup/index", this.index, [Role.Admin, Role.Moderator]);
        
        this.onGet("/basic-setup/property-area", this.propertyArea, [Role.Admin, Role.Moderator]);
        this.onGet("/basic-setup/property-area/create", this.createPropertyArea, [Role.Admin, Role.Moderator]);
        this.onPost("/basic-setup/property-area/create", this.createPropertyArea, [Role.Admin, Role.Moderator]);


        this.onGet("/basic-setup/development-type", this.developmentType, [Role.Admin, Role.Moderator]);
        this.onGet("/basic-setup/development-type/create", this.createDevelopmentType, [Role.Admin, Role.Moderator]);
        this.onPost("/basic-setup/development-type/create", this.createDevelopmentType, [Role.Admin, Role.Moderator]);
    }


    public async index(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Basic Setup"
        res.view('basic-setup/index');
    }


    public async propertyArea(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Property Area"
        const p: any = req.query.page;
        const s: any = req.query.size;
        let page: number = parseInt(p, 10);
        if (!page || page < 0) page = 1;
        let size: number = parseInt(s, 10);
        if (!size || size < 1) size = 10;
        const propertyAreaPage: IPropertyAreaPage  = await this.PropertyAreaProvider.list( page, size );
        res.bag.propertyAreaPage = propertyAreaPage;
        res.bag.flashMessage = req.flash('flashMessage');
        res.view('basic-setup/property-area/index');
    }


    public async createPropertyArea(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Create Property Area";
        if(req.method === "GET"){
            res.view('basic-setup/property-area/create');
        }else if(req.method === "POST"){
            const areaName = req.body.areaName;
            if (!areaName) {
                res.bag.errorMessage = "Property area name is required";
                return res.view('basic-setup/property-area/create')
            }else{
                const user : EmbededUser = {id: req.user.id, fullName: req.user.name };
                await this.PropertyAreaProvider.create(areaName, user);
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
        const p: any = req.query.page;
        const s: any = req.query.size;
        let page: number = parseInt(p, 10);
        if (!page || page < 0) page = 1;
        let size: number = parseInt(s, 10);
        if (!size || size < 1) size = 10;
        const developmentTypePage: IDevelopmentTypePage  = await this.DevelopmentTypeProvider.list( page, size );
        res.bag.developmentTypePage = developmentTypePage;
        res.bag.flashMessage = req.flash('flashMessage');
        res.view('basic-setup/development-type/index');
    }


    public async createDevelopmentType(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Create Development Type";
        if(req.method === "GET"){
            res.view('basic-setup/development-type/create');
        }else if(req.method === "POST"){
            const name = req.body.name;
            if (!name) {
                res.bag.errorMessage = "Development type name is required";
                return res.view('basic-setup/development-type/create')
            }else{
                const user : EmbededUser = {id: req.user.id, fullName: req.user.name };
                await this.DevelopmentTypeProvider.create(name, user);
                req.flash('flashMessage', 'Development type created successfully.');
                res.redirect('/basic-setup/development-type');
            }
        }else{
            res.bag.errorMessage = "Invalid Request";
            res.view('/basic-setup/development-type');
        }

    }






}