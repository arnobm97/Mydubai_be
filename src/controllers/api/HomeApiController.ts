import { Controller } from "../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../core/Types";
import {IPropertyAreaProvider, IPropertyArea } from "../../core/IPropertyAreaProvider";
import {ISliderProvider, ISlider, ISliderPage } from "../../core/ISliderProvider";
import {IDeveloperTypeProvider, IDeveloperType, IDeveloperTypePage } from "../../core/IDeveloperTypeProvider";


export class HomeApiController extends Controller {

    private config = require("../../../config.json");
    private response = { status: 200, error: false, message: "", data: {} };
    private PropertyAreaProvider: IPropertyAreaProvider;
    private DeveloperTypeProvider: IDeveloperTypeProvider;
    private SliderProvider: ISliderProvider;

    public onRegister(): void {
        this.onGet("/api/v1/:lang/get-home", this.home);
    }


    public async home(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        try{
            const lang: string =  req.params.lang;
            const sliders: ISlider[] = await this.SliderProvider.getAll(lang);
            const payload = {sliders, lang: res.bag.lang, langList: res.bag.langList };
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
  

    


}