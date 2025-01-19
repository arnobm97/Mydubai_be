import { Controller } from "../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../core/Types";
import {ISliderProvider, ISlider,  } from "../../core/ISliderProvider";
import {IDevelopmentTypeProvider, IDevelopmentType } from "../../core/IDevelopmentTypeProvider";
import {IPropertyProvider, IProperty } from "../../core/IPropertyProvider";


export class HomeApiController extends Controller {

    private response = { status: 200, error: false, message: "", data: {} };
    private SliderProvider: ISliderProvider;
    private DevelopmentTypeProvider: IDevelopmentTypeProvider;
    private PropertyProvider: IPropertyProvider;

    public onRegister(): void {
        this.onGet("/api/v1/:lang/get-home", this.home);
    }


    public async home(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        try{
            const lang: string =  req.params.lang;
            const sliders: ISlider[] = await this.SliderProvider.getAll(lang);
            const devType: IDevelopmentType[] = await  this.DevelopmentTypeProvider.getAll(lang);
            let letestOffplan: IProperty[];
            let letestReady: IProperty[];
            for(const item of devType){
                if((item.name).toLowerCase() === 'off plan' || (item.name).toLowerCase() === 'off-plan'){
                    letestOffplan = await this.PropertyProvider.letestByDevelopmentType(item._id, 5);
                }else if((item.name).toLowerCase() === 'ready'){
                    letestReady = await this.PropertyProvider.letestByDevelopmentType(item._id, 5);
                }else{
                    // do noting
                }
            }
            const payload = {sliders, letestOffplan, letestReady, lang: res.bag.lang, langList: res.bag.langList };
            this.response.message = 'success';
            this.response.data = payload;
            return res.status(200).send(this.response);
        }catch(err){
            const sliders: any = null;
            const letestOffplan: any = null;
            const letestReady: any = null;
            const payload = {sliders, letestOffplan, letestReady, lang: res.bag.lang, langList: res.bag.langList };
            this.response.message = err;
            this.response.status = 500;
            this.response.data = payload;
            return res.status(200).send(this.response);
        }
    }





}