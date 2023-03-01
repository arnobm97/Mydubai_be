import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Role } from "../core/IUserProvider";
import { IUserProvider } from "../core/IUserProvider";
import { IPropertyProvider } from "../core/IPropertyProvider";
import { IDeveloperTypeProvider } from "../core/IDeveloperTypeProvider";
import { IPropertyAreaProvider } from "../core/IPropertyAreaProvider";


export class DashboardController extends Controller {

    private UserProvider: IUserProvider;
    private PropertyProvider: IPropertyProvider;
    private DeveloperTypeProvider: IDeveloperTypeProvider;
    private PropertyAreaProvider: IPropertyAreaProvider;
    private config = require("../../config.json");

    public onRegister(): void {
        this.onGet("/", this.index, [Role.Admin, Role.Moderator, Role.User]);
    }

    /**
     * Shall provide the dashboard interface with stats data
     */
    public async index(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Dashboard"
        const stats: any = [];
        stats.totalProperties = await this.PropertyProvider.count();
        stats.totalDevelopers = await this.DeveloperTypeProvider.count();
        stats.totalAreas = await this.PropertyAreaProvider.count();
        stats.total_users = await this.UserProvider.count();
        res.bag.stats = stats;
        // return res.send(res.bag);
        res.view('dashboard/admin');
    }





}