
import jwt from "jsonwebtoken";
import { IUserToken, Role } from "./IUserProvider";
import { HttpRequest, HttpResponse, NextFunc } from "./Types";
import { Middleware } from "./Middleware";
import crypto from "crypto";
import { Application } from "./Application";


export class Authenticator extends Middleware {

    public User: IUserToken;

    public readonly AUTH_COOKIE_NAME = "__session_auth";

    public constructor(private app: Application) { super(); }

    /**
     * Authenticate the user and return the token
     * If authentication fails, it return null
     * @param mobile to authenticate for
     * @param password to authenticate with
     */
    public async authenticate(mobile: string, password: string) {
        // Find the user to authenticate or return null on failure
        const user = await this.app.UserProvider.get(mobile);
        if(!user || !user.isActive || user.password !== this.digestPassword(password)) return (req: HttpRequest, res: HttpResponse) => false;
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            department: user.department,
            role: user.role,
            signedAt: new Date(),
        }, this.app.config.sessionSecret, { expiresIn: '365d' } );

        return (req: HttpRequest, res: HttpResponse) => {
            if(token) {
                res.bag.user = user;
                res.bag.token = token;
                return true;
            } else {
                return false;
            }
        };

    }




    public digestPassword(pass: string) : string {
        return crypto.createHmac('sha256', this.app.config.authSecret)
        .update(`${pass} - ${this.app.config.authSalt}`)
        .digest('hex');
    }



    /**
     * Express middleware for user authentication
     * we could do the autentication in our application layer but for now let's bind to express
     * @param req Http Request object with data
     * @param resp Http Response object for information
     * @param next Function to execute
     */
    public process(req: HttpRequest, resp : HttpResponse, next: NextFunc): void {
        try{
            req.user = jwt.verify(req.headers.authorization, this.app.config.sessionSecret) as IUserToken;
            next();
        } catch(ex) {
            next();
        }
    }



}