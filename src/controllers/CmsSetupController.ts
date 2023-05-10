import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import {ISliderProvider, ISliderPage, ISlider } from "../core/ISliderProvider";
import { Role, EmbededUser } from "../core/IUserProvider";


export class CmsSetupController extends Controller {

    private SliderProvider: ISliderProvider;
    private config = require("../../config.json");

    public onRegister(): void {
        this.onGet("/cms-setup/index", this.index, [Role.Admin, Role.Moderator]);
        this.onGet("/cms-setup/sliders", this.slider, [Role.Admin, Role.Moderator]);
        this.onGet("/cms-setup/sliders/create", this.createSlider, [Role.Admin, Role.Moderator]);
        this.onPost("/cms-setup/sliders/create", this.createSlider, [Role.Admin, Role.Moderator]);
        this.onGet("/cms-setup/sliders/update/:id", this.updateSlider, [Role.Admin, Role.Moderator]);
        this.onPost("/cms-setup/sliders/update/:id", this.updateSlider, [Role.Admin, Role.Moderator]);
        this.onGet("/cms-setup/sliders/delete/:id", this.deleteSlider, [Role.Admin, Role.Moderator]);
    }


    public async index(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Basic Setup"
        res.view('cms-setup/index');
    }


    public async slider(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Sliders"
        const queryLanguage: any = req.query.lang;
        const p: any = req.query.page;
        const s: any = req.query.size;
        let page: number = parseInt(p, 10);
        if (!page || page < 0) page = 1;
        let size: number = parseInt(s, 10);
        if (!size || size < 1) size = 15;
        const sliderPage: ISliderPage  = await this.SliderProvider.list(page, size, queryLanguage);
        res.bag.sliderPage = sliderPage;
        res.bag.currentLang = queryLanguage;
        res.bag.flashMessage = req.flash('flashMessage');
        res.view('cms-setup/sliders/index');
    }


    public async createSlider(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Create Slider";
        if(req.method === "GET"){
            res.view('cms-setup/sliders/create');
        }else if(req.method === "POST"){
            const lang = req.body.lang;
            const title = req.body.title;
            const description1 = req.body.description1;
            const description2 = req.body.description2;
            const description3 = req.body.description3;
            const targetLink = req.body.targetLink;
            const image = req.body.image;
            
            if (!title) {
                res.bag.errorMessage = "Slider's title is required";
                return res.view('cms-setup/sliders/create')
            }else if (!lang) {
                res.bag.errorMessage = "Slider's language is required";
                return res.view('cms-setup/sliders/create')
            }else if (!image) {
                res.bag.errorMessage = "Slider's image is required";
                return res.view('cms-setup/sliders/create')
            }else{
                const user : EmbededUser = {id: req.user.id, fullName: req.user.name };
                await this.SliderProvider.create(lang, title, description1, description2, description3, targetLink, image, user);
                req.flash('flashMessage', 'Slider created successfully.');
                res.redirect('/cms-setup/sliders');
            }
        }else{
            res.bag.errorMessage = "Invalid Request";
            res.view('/cms-setup/sliders');
        }
    }



    public async updateSlider(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Update Slider";
        let slider: ISlider = await this.SliderProvider.get(req.params.id);
        if(req.method === "GET"){
            res.bag.sliderItem = slider;
            res.view('cms-setup/sliders/update');
        }else if(req.method === "POST"){
            const lang = req.body.lang;
            const title = req.body.title;
            const description1 = req.body.description1;
            const description2 = req.body.description2;
            const description3 = req.body.description3;
            const targetLink = req.body.targetLink;
            const image = req.body.image;
            if (!title) {
                res.bag.errorMessage = "Slider's title is required";
                return res.view('cms-setup/sliders/create')
            }else if (!lang) {
                res.bag.errorMessage = "Slider's language is required";
                return res.view('cms-setup/sliders/create')
            }else if (!image) {
                res.bag.errorMessage = "Slider's image is required";
                return res.view('cms-setup/sliders/create')
            } else{
                slider.lang = lang;
                slider.title = title;
                slider.description1 = description1;
                slider.description2 = description2;
                slider.description3 = description3;
                slider.targetLink = targetLink;
                slider.image = image;
                slider.save();
                req.flash('flashMessage', 'Slider updated successfully.');
                res.redirect('/cms-setup/sliders');
            }
        }else{
            res.bag.errorMessage = "Invalid Request";
            res.view('/settings/departments');
        }
    }





    public async deleteSlider(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        await this.SliderProvider.delete(req.params.id);
        req.flash('flashMessage', 'Slider deleted successfully.');
        res.redirect('/cms-setup/sliders');
    }


}