import { HttpRequest, HttpResponse, NextFunc } from "./Types";
import { Middleware } from "./Middleware";
import { v4 } from 'uuid';

export class Session extends Middleware {

    /**
     * Session initialization middleware for express
     */
    public process(req: HttpRequest, resp : HttpResponse, next: NextFunc): void {
        if(!req.signedCookies.__session) {
            resp.cookie("__session", this.createSession(), { path: "/", httpOnly: true, signed: true, sameSite: "strict" });
        }

        // Pass execution to the next
        next();
    }

    private createSession(): string {
        return JSON.stringify({ sessionId: v4() , time: new Date() });
    }
}