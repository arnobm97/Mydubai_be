import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Role, IUserPage } from "../core/IUserProvider";
import { IUserProvider, IUser } from "../core/IUserProvider";
import { Authenticator } from "../core/Authenticator";


export class UserController extends Controller {

    private UserProvider: IUserProvider;
    private Authenticator: Authenticator;
    private config = require("../../config.json");

    public onRegister(): void {
        this.onGet("/users", this.index, [Role.Admin, Role.Moderator, Role.User]);
        this.onGet("/users/details/:id", this.details, [Role.Admin, Role.Moderator]);
        this.onGet("/users/create", this.createUser, [Role.Admin]);
        this.onPost("/users/create", this.createUser, [Role.Admin]);
        this.onGet("/users/update/:id", this.updateUser, [Role.Admin]);
        this.onPost("/users/update/:id", this.updateUser, [Role.Admin]);
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
        res.bag.flashMessage = req.flash('flashMessage');
        res.view('user/index');
    }


    public async details(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Users Details"
        const user: IUser  = await this.UserProvider.getById(req.params.id);
        res.bag.user = user;
        res.view('user/details');
    }


    public async createUser(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Create User";
        if(req.method === "GET"){
            res.view('user/create');
        }else if(req.method === "POST"){
            const fullName = req.body.fullName;
            const email = req.body.email;
            const password = req.body.password;
            const confirmPassword = req.body.confirmPassword;
            const role = req.body.role;
            if (!fullName || !email || !password) {
                res.bag.errorMessage = "Full Name, Username & Password is required";
                return res.view('user/create')
            }else if (!password || !confirmPassword) {
                res.bag.errorMessage = "Password & Ponfirm Password is required";
                return res.view('user/create')
            } else if (password.length < 6) {
                res.bag.errorMessage = "Password must be minimum 6 character";
                return res.view('user/create')
            }
            else if (password !== confirmPassword) {
                res.bag.errorMessage = "Password & Confirm Password do not matched";
                return res.view('user/create')
            }if(!(role in Role)) {
                    res.bag.errorMessage = "Invalid user role";
                    return res.view('user/create')
            }else{
                const isExists = await this.UserProvider.get(email);
                if (isExists) {
                    res.bag.errorMessage = "This Username is already registered";
                    return res.view('user/create');
                } else {

                    const userPassword = this.Authenticator.digestPassword(password);
                    await this.UserProvider.create(fullName, email, userPassword, role);
                    req.flash('flashMessage', 'User created successfully.');
                    res.redirect('/users');
                }
            }
        }else{
            res.bag.errorMessage = "Invalid Request";
            res.view('user/create');
        }

    }

    public async updateUser(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        res.bag.pageTitle = this.config.appTitle+" | Create User";
        const id = req.params.id;
        res.bag.userToUpdate = await this.UserProvider.getById(id);

        if(req.method === "GET"){
            res.view('user/update');
        }else if(req.method === "POST"){
            // return res.send(req.body);
            const fullName = req.body.fullName;
            const role = req.body.role;
            const isActive = req.body.isActive;
            const avatar = req.body.avatar;
            const password = req.body.password;
            const confirmPassword = req.body.confirmPassword;

            // if password exists
            if(password && confirmPassword){
                if (!password || !confirmPassword) {
                    res.bag.errorMessage = "Password & Ponfirm Password is required";
                    return res.view('user/update')
                } else if (password.length < 6) {
                    res.bag.errorMessage = "Password must be minimum 6 character";
                    return res.view('user/update')
                }
                else if (password !== confirmPassword) {
                    res.bag.errorMessage = "Password & Confirm Password do not matched";
                    return res.view('user/update')
                }else{
                    // nothing & continue ...
                }
            }
            if (!fullName) {
                res.bag.errorMessage = "Full Name is required";
                return res.view('user/update')
            }if(!(role in Role)) {
                    res.bag.errorMessage = "Invalid user role";
                    return res.view('user/update')
            }else{
                await this.UserProvider.getById(id).then(async user => {
                    user.fullName = fullName;
                    user.role = role;
                    user.avatar = avatar;
                    if(password){
                        user.password = this.Authenticator.digestPassword(password);
                    }
                    if(isActive === 'on'){
                        user.isActive = true;
                    }else{
                        user.isActive = false;
                    }
                    await user.save().then(savedUser => {
                        req.flash('flashMessage', 'User updated successfully');
                        res.redirect('/users');
                    }).catch(err => {
                        req.flash('flashMessage', 'Something went wrong, Please try later.');
                        res.redirect('/users');
                    })
                }).catch(error => {
                        req.flash('flashMessage', 'User not found, Maybe it already has been deleted.');
                        res.redirect('/users');
                });
            }
        }else{
            res.bag.errorMessage = "Invalid Request";
            res.view('user/update');
        }
    }





}