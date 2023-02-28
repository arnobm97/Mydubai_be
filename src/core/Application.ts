
import { ActionCallback, HttpMethods } from "./Action";
import { Dictionary } from "./Dictionary";
import { Controller } from "./Controller";
import express, { Express, response } from "express";
import { Role, IUserProvider } from "./IUserProvider";
import { NextFunc, HttpRequest, HttpResponse, PathParam } from "./Types";
import { Authenticator } from "./Authenticator";
import { Session } from "./Session";
import CookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { Config } from "./Config";
import { Middleware } from "./Middleware";
import { Extention } from "./Extention";
import { Menu } from "./Menu";
import { IMailer } from "./IMailer";
import fs from "fs";
import session  from "express-session";
import flash from "connect-flash";


export class Application {

    private services: Dictionary<any>;
    private Controllers: Controller[];
    private menus: Dictionary<Menu>;
    private formatters: Dictionary<any>;
    private lang: any;

    // Injected dependencies
    public UserProvider: IUserProvider;
    public Express: Express;    // Public in case we need to add additional customization from app.ts
    public Mailer: IMailer;
    private Authenticator: Authenticator;
    private Session: Session;

    public constructor(public config: Config) {
        this.services = new Dictionary<any>();
        this.Controllers = new Array<Controller>();
        this.menus = new Dictionary<Menu>();
        this.formatters = new Dictionary<any>();

        // Create an express app and bind to our system
        this.set("Express", express());

        // Parse incoming request bodies
        this.Express.use(bodyParser.json());
        this.Express.use(bodyParser.urlencoded({ extended: true }));
        this.Express.use(CookieParser(config.cookieSecret));

        // flash message & session
        this.Express.use(session({
            secret: 'secret key',
            resave: false,
            saveUninitialized: false
        }));
        this.Express.use(flash());

        // Make session available to all controllers
        this.set("Session", new Session());
        this.set("Authenticator", new Authenticator(this));
        this.set("config", config);

        // Read language file
        const langFIle: any = fs.readFileSync("./locales/language.json");
        this.lang = JSON.parse(langFIle);

        // Register session middleware
        this.use(new Extention());
        this.use(this.Session);
        this.use(this.Authenticator);

        this.Express.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            next();
        });
    }

    public registerAction(context: Controller, method: HttpMethods, route: PathParam, callback: ActionCallback, roles: Role[]): void {

        if(!roles) roles = [];

        const wrappedCb = this.execute(context, callback, roles);

        switch(method) {
            case HttpMethods.GET:
                this.Express.get(route, wrappedCb);
                break;
            case HttpMethods.POST:
                this.Express.post(route, wrappedCb);
                break;
            case HttpMethods.PUT:
                this.Express.put(route, wrappedCb);
                break;
            case HttpMethods.PATCH:
                this.Express.patch(route, wrappedCb);
                break;
            case HttpMethods.DELETE:
                this.Express.delete(route, wrappedCb);
                break;
        }
    }

    public registerController(ControllerClass: typeof Controller): void {
        const controller:Controller = new ControllerClass();
        controller.Register(this);

        this.Controllers.push(controller);
    }

    private execute(context: Controller, callback: ActionCallback, roles: Role[]) {
        return (req: HttpRequest, resp : HttpResponse, next: NextFunc) => {
            if(roles.length > 0 && (!req.user || roles.indexOf(req.user.role) === -1)) {
                if(!req.user){
                    return resp.redirect(`/login?ref=${encodeURIComponent(req.path)}`);
                }
                return resp.view("error/access-denide");
            } else {
                this.populateBag(req, resp);
                callback.call(context, req, resp, next);
            }
        }
    }

    private populateBag(req: HttpRequest, resp : HttpResponse) {
        if(!resp.bag.menu) resp.bag.menu = { main: { items: [] }};
        for(const key of this.menus.Keys()) {
            const menu = { items: this.menus.Item(key).items.filter( mi => mi.for.length === 0 || (req.user && mi.for.indexOf(req.user.role) >= 0)) };
            resp.bag.menu[key] = menu;
        }
        resp.bag.fmt = {};
        for(const key of this.formatters.Keys()) {
            resp.bag.fmt[key] = this.formatters.Item(key);
        }
        resp.bag.loggedUser = req.user;
        if(req.cookies.AppLanguage === 'bn'){
            resp.bag.lang = this.lang.bn;
            resp.bag.switchLangBtn = {text: "English", url: "/en" };
        }
        else if(req.cookies.AppLanguage === 'en'){
            resp.bag.lang = this.lang.en;
            resp.bag.switchLangBtn = {text: "বাংলা", url: "/bn" };
        }else{
            resp.bag.lang = this.lang.en;
            resp.bag.switchLangBtn = {text: "বাংলা", url: "/bn" };
        }
    }

    /**
     * Register formatter function and make it available to views
     * @param name of the formatter
     * @param value as a callable
     */
    public setFormatter(name: string, value: unknown) {
        this.formatters.Add(name, value);
    }

    /**
     * Add a middleware to execute on every HTTP call
     * @param middleware to execute
     */
    public use(middleware: Middleware): void {
        this.Express.use((req: HttpRequest, resp : HttpResponse, next: NextFunc) => {
            middleware.process(req, resp, next);
        });
    }

    /**
     * Set static resource paths
     * @param root directory root
     * @param options like cache control, max age etc
     */
    public setStatic(root: string, options?: {}) {
        this.Express.use(express.static(root, options));
    }

    /**
     * Set the views directory to use
     * @param root directory for the views
     */
    public viewDir(root: string): void {
        this.Express.set("views", root);
    }

    /**
     * Set the view engine
     * @param name of the view engine
     */
    public viewEngine(name: string): void {
        this.Express.set("view engine", name);
    }

    /**
     * Set a menu to use accross all views, Menus set here will be available in viewbag based filtered by user role
     * @param name of the menu to set, default menu is `main`
     * @param menu to set for the name
     */
    public setMenu(name: string, menu: Menu): void {
        this.menus.Add(name, menu);
    }

    /**
     * Get a menu based on the name
     * @param name of the menu to get
     */
    public getMenu(name: string): Menu {
        return this.menus.Item(name);
    }

    /**
     * Register a service with specified name
     */
    public set(name: string, value: unknown): void {
        this.services.Add(name, value);

        // Also bind the object to exchange directly so that, this.name can be called
        Object.defineProperty(this, name, {
            get() {
                return value;
            }
        });

        // Assign it to all existing controller as well
        for(const controller of this.Controllers) {
            Object.defineProperty(controller, name, {
                get() {
                    return value;
                }
            });
        }
    }

    /**
     * Get a registered service from registry
     * @param name name of the service to get
     */
    public get<T>(name: string): T {
        if(this.services.ContainsKey(name)) {
            return this.services.Item(name);
        }
    }

    /**
     * Get a list of registered service names
     */
    public getServiceNames(): string[] {
        return this.services.Keys();
    }

    /**
     * Finally initialize everything that can't be initialized in constractor
     * and start listening to the specified port.
     */
    public listen(port:number, callback?: (...args: any[]) => void): void {
        this.Express.listen(port, callback);
    }
}