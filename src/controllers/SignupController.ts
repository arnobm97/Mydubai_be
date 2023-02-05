import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Role, IUserProvider, MembershipType, Department, Club } from "../core/IUserProvider";
import { Authenticator } from "../core/Authenticator";
import generatePassword from "generate-password";


export class SignupController extends Controller {
  private UserProvider: IUserProvider;
  private Authenticator: Authenticator;



  public onRegister(): void {
    this.onPost("/banani-club-member/api/v1/signup", this.userSignup);
  }


  public async userSignup(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
      await this.UserProvider.create(req.body.name, req.body.email, req.body.mobile, Role.Superadmin, MembershipType.Parmanent, Department.Accounts, req.body.image, Club.BananiClub).then(async user => {
        user.isActive = true;
        user.password = this.Authenticator.digestPassword(req.body.password);
        user.save();
        resp.status(200);
        return resp.send( { status: 200, error: false, message: "Sign up success.", action: "", data: {} });
      }).catch(async error => {
        resp.status(200);
        if(error.message.indexOf("duplicate key") >= 0){
          return resp.send( { status: 200, error: true, message: "This email/phone is already registred.", action: "", data: {} });
        }else{
          return resp.send( { status: 200, error: true, message: error, action: "", data: {} });
        }
      });
  };







}
