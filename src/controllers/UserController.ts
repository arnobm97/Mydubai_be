import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Role, IUserPage } from "../core/IUserProvider";
import { IUserProvider } from "../core/IUserProvider";


export class UserController extends Controller {

    private UserProvider: IUserProvider;
    private config = require("../../config.json");

    public onRegister(): void {
        this.onGet("/users", this.index, [Role.Admin, Role.Moderator, Role.User]);
    }

    public async index(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Users"
        const p: any = req.query.page;
        const s: any = req.query.size;
        let page: number = parseInt(p, 10);
        if (!page || page < 0) page = 1;
        let size: number = parseInt(s, 10);
        if (!size || size < 1) size = 10;
        const userPage: IUserPage  = await this.UserProvider.getAll( page, size );
        res.bag.userPage = userPage;
        // res.send(res.bag.userPage);
        res.view('user/index');
    }





}