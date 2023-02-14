
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
     * @param email to authenticate for
     * @param password to authenticate with
     */
    public async authenticate(email: string, password: string, remember: boolean) {
        // Find the user to authenticate or return null on failure
        const user = await this.app.UserProvider.get(email);
        if(!user || !user.isActive || user.password !== this.digestPassword(password)) return (req: HttpRequest, res: HttpResponse) => false;

        const token = jwt.sign({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            signedAt: new Date(),
            remeber: remember,
            check: user.password.substr(0, 6)
        }, this.app.config.sessionSecret);

        const cookieName = this.AUTH_COOKIE_NAME;

        return (req: HttpRequest, res: HttpResponse) => {
            if(token) {
                if (remember) {  // Keep the cookie for 30 days
                    res.cookie(cookieName, token,
                        { httpOnly: true, signed: true, sameSite: "strict", maxAge: 30 * 24 * 60 * 60 }
                    );
                } else {
                    res.cookie(cookieName, token,
                        { httpOnly: true, signed: true, sameSite: "strict" }
                    );
                }

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

    private async reSign(req: HttpRequest, resp : HttpResponse) {
        if(req.user) {
            // (We can potentially check after certain time of signed at as well)
            // To reduce DB IO
            const user = await this.app.UserProvider.get(req.user.email);
            // Revoke access if user is removed or deactivated or changed their password
            if(!user || !user.isActive || req.user.check !== user.password.substr(0, 6)) { req.user = null; resp.clearCookie(this.AUTH_COOKIE_NAME); return; }
            // Following 3 parameters shall be updated on resign
            req.user.name = user.fullName;
            req.user.role = user.role;
            req.user.signedAt = new Date();
            const token = jwt.sign(req.user, this.app.config.sessionSecret);

            if (req.user.remember) {  // Keep the cookie for 30 days
                resp.cookie(this.AUTH_COOKIE_NAME, token,
                    { httpOnly: true, signed: true, sameSite: "strict", maxAge: 30 * 24 * 60 * 60 }
                );
            } else {
                resp.cookie(this.AUTH_COOKIE_NAME, token,
                    { httpOnly: true, signed: true, sameSite: "strict" }
                );
            }
        }
    }

    /**
     * Express middleware for user authentication
     * we could do the autentication in our application layer but for now let's bind to express
     * @param req Http Request object with data
     * @param resp Http Response object for information
     * @param next Function to execute
     */
    public process(req: HttpRequest, resp : HttpResponse, next: NextFunc): void {

        if(req.signedCookies[this.AUTH_COOKIE_NAME]) {
            try{
                req.user = jwt.verify(req.signedCookies[this.AUTH_COOKIE_NAME], this.app.config.sessionSecret) as IUserToken;
                this.reSign(req, resp).then(
                    () => next()
                );
            } catch(ex) {
                next();
            }
        } else {
            next();
        }
    }
}