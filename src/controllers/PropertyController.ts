import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Role } from "../core/IUserProvider";
import { IPropertyProvider, IProperty, IPropertyLang, IPropertyType } from "../core/IPropertyProvider";



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

        return res.send(req.body);




        const testproperty: any = {
            lang: IPropertyLang.EN,
            propertyNo: 1,
            propertyName: 'Palm Hills',
            propertyType: IPropertyType.READY,
            propertyDescription: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            propertyArea: {
                id: '12345678',
                areaName: 'Dubai',
            },
            developmentType: {
                id: "12345678",
                name: "URBAN",
            },
            developerType: {
                id: "12345678",
                name: "CONCORD",
            },
            areaSize: "200 M",
            highlights: ['Text 1', 'Text 2', 'Text 3', 'Text 4','Text 5', 'Text 6', 'Text 7', 'Text 8'],
            amenities: {
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                features: ['Text 1', 'Text 2', 'Text 3', 'Text 4']
            },
            completion: "2023, June",
            startingPrice: 125700,
            location: {
                locDescription:"Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                position: [23.32,90.223],
                nearby: [
                    {
                        title: "Mosque",
                        icon: "Mosque",
                        position: [23.32,90.223],
                    },{
                        title: "School",
                        icon: "School",
                        position: [23.32,90.223],
                    }
                ]
            },
            paymentPlan: [
                {
                    milestone: "Text 1",
                    installment: 6,
                    percentage: "10%",
                    date: new Date(),
                    notes: "Test Notes 1"
                },
                {
                    milestone: "Text 2",
                    installment: 3,
                    percentage: "12%",
                    date: new Date(),
                    notes: "Test Notes 2"
                }
            ],
            unitType : {
                title: "Bedroom",
                count: '3',
                size: "430 SFT"
            },
            brcure: "https://cdn.offplan/media/562374ghvsdhfvh.pdf",
            images: [
                {
                    type: "Slider",
                    metaDescription: "search for lorem ipsum",
                    path: "https://cdn.offplan/media/562374ghvsdhfvh.png"
                },
                {
                    type: "top-left",
                    metaDescription: "search for lorem ipsum",
                    path: "https://cdn.offplan/media/562374ghvsdhfvh.png"
                }
            ],
            videos: [
                {
                    type: "Take a tour",
                    path: "https://cdn.offplan/media/562374ghvsdhfvh.png"
                },
                {
                    type: "Ads",
                    path: "https://cdn.offplan/media/562374ghvsdhfvh.png"
                }
            ],
            createBy: {
                id: "3453456gyd777",
                fullName: "Test user name"
            }



        };


        await this.PropertyProvider.create(testproperty).then(async property => {
            res.bag.successMessage = "Done";
        }).catch(async error => {
            res.bag.errorMessage = "Error";
        });


        return res.send(res.bag);


    }





}