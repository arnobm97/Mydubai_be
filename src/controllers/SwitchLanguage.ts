import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";

export class SwitchLanguage extends Controller {
    public onRegister(): void {
        this.onGet("/en", this.english);
        this.onGet("/bn", this.bangla);
    }
    public async english(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.cookie('AppLanguage', 'en');
        res.redirect(req.header('Referer') || '/');
    }
    public async bangla(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.cookie('AppLanguage', 'bn');
        res.redirect(req.header('Referer') || '/');
    }
}