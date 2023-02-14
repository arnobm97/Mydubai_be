import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Role, IUserProvider } from "../core/IUserProvider";
import UserModel from "../models/UserModel";
import { Authenticator } from "../core/Authenticator";


export class SetupController extends Controller {
  private UserProvider: IUserProvider;
  private Authenticator: Authenticator;
  private config = require("../../config.json");

  public onRegister(): void {
    this.onGet("/setup", this.index);
    this.onPost("/setup", this.index);
  }

  public async index(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
    resp.bag.pageTitle = this.config.appTitle+" Initilize Setup";
    if ((await UserModel.countDocuments()) > 0) {
      resp.view("setup/done");
    } else {
      if (req.method === "POST") {
        const fullName = req.body.fullName;
        const email = req.body.email;
        const role = Role.Admin;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const pwdFilter = /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,15}$/;
        if (!pwdFilter.test(password)) {
            resp.bag.errorMessage = "The password must be minimum 8 characters which contain at least one numeric digit and a special character";
            return resp.view("setup/index");
        }
        if(password !== confirmPassword){
          resp.bag.errorMessage = "The password and confirmation password do not match.";
          return resp.view("setup/index");
        }
        await this.UserProvider.create(fullName, email, password,role).then(async (user) => {
            user.isActive = true;
            user.password = this.Authenticator.digestPassword(password);
            user.save();
            resp.view("setup/done");
          })
          .catch(async (error) => {
            console.log(error);
            resp.bag.errorMessage =
              error.message.indexOf("duplicate key") >= 0
                ? "This email is already registed! Have you forgotten the password"
                : "There was an error creating new account. Please contact support.";
            resp.view("setup/index");
          });
      } else {
        resp.view("setup/index");
      }
    }
  }
}
