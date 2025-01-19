import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import {ICustomerInterestProvider, ICustomerInterest, ICustomerInterestPage } from "../core/ICustomerInterestProvider";
import { Role } from "../core/IUserProvider";


export class CustomerInterestController extends Controller {

    private CustomerInterestProvider: ICustomerInterestProvider;
    private config = require(`../../${(process.env.NODE_ENV || 'development') === 'production' ? "config.prod.json" : "config.dev.json"}`);

    public onRegister(): void {
        this.onGet("/customer-interest/index", this.index, [Role.Admin, Role.Moderator]);
        this.onGet("/customer-interest/delete/:id", this.delete, [Role.Admin]);
    }


    public async index(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Customer Interest"
        const p: any = req.query.page;
        const s: any = req.query.size;
        let page: number = parseInt(p, 10);
        if (!page || page < 0) page = 1;
        let size: number = parseInt(s, 10);
        if (!size || size < 1) size = 15;
        const customerInterestPage: ICustomerInterestPage  = await this.CustomerInterestProvider.list(page, size);
        res.bag.customerInterestPage = customerInterestPage;
        res.bag.flashMessage = req.flash('flashMessage');
        // return res.send(res.bag);
        res.view('customer/query-form/index');
    }


    public async delete(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        await this.CustomerInterestProvider.delete(req.params.id);
            req.flash('flashMessage', 'Customer query deleted successfully.');
            return res.redirect('/customer-interest/index');
    }




}




















