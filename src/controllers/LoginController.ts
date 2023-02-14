import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Authenticator } from "../core/Authenticator";

export class LoginController extends Controller {

    private Authenticator: Authenticator;
    private config = require("../../config.json");

    public onRegister(): void {
        this.onGet("/login", this.loginView);
        this.onPost("/login", this.loginCheck);
        this.onGet("/logout", this.logout);
    }
    /**
     * Shall provide the admin login interface
     */
    public loginView(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" Dashboard | Login";
        res.view("login");
    }
    /**
     * Login form is submitted to `loginCheck`, it validates login and redirects User to appropriate page
     */
    public loginCheck(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        const email = req.body.email;
        const password = req.body.password;
        const remember = !!req.body.remember;
        const ref = typeof req.query.ref !== "undefined"? req.query.ref as string : '/';
        this.Authenticator.authenticate(email, password, remember).then(token => {
            if(token(req, res)) {
                res.redirect(ref);
            } else {
                res.bag.errorMessage = "Invalid email or password";
                res.view("login");
            }
        }).catch(err => {
            res.bag.errorMessage = "Please try later.";
            res.view("login");
        });
    };
    /**
     * Log out and redirect user to login
     */
    public logout(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.clearCookie(this.Authenticator.AUTH_COOKIE_NAME);
        res.redirect("/");
    }
}