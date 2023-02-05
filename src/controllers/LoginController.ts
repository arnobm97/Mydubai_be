import { Controller } from "../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../core/Types";
import { Authenticator } from "../core/Authenticator";
import {IUser, ISession, IUserProvider, Role } from "../core/IUserProvider";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {Config} from "../core/Config"
import fs from "fs";
const APP_CONFIG: Config = new Config(JSON.parse(fs.readFileSync("config.json").toString()));


export class LoginController extends Controller {

    private Authenticator: Authenticator;
    private UserProvider: IUserProvider;
    private response = { status: 200, error: false, message: "", action: "", data: {} };


    public onRegister(): void {
        this.onPost("/banani-club-member/api/v1/login", this.loginCheck);
        this.onPost("/banani-club-member/api/v1/login-with-otp", this.loginWithOTP);
        // this.onPost("/ei-dokan/api/v1/refresh-token", this.RefreshToken);
        // this.onPost("/ei-dokan/api/v1/send/otp", this.SendOTP);
        // this.onPost("/ei-dokan/api/v1/profile/update", this.UpdateProfile);
        // this.onPost("/ei-dokan/api/v1/account/set/password", this.UpdatePassword);
        // this.onPost("/ei-dokan/api/v1/account/reset/password", this.ResetPassword);
    }


    public loginCheck(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        const mobile = req.body.mobile;
        const password = req.body.password;
        this.Authenticator.authenticate(mobile, password).then(async token => {
            if(token(req, resp)) {
                const refreshToken = crypto.createHmac('sha256', "secret").update(new Date().getTime().toString()).digest('hex');
                await this.UserProvider.createSession(mobile, refreshToken);
                resp.bag.refreshToken = refreshToken;
                resp.bag.user.password  = null;
                resp.status(200);
                return resp.send( { status: 200, error: false, message: "login success.", action: "", data: resp.bag });
            } else {
                resp.status(200);
                return resp.send( { status: 200, error: true, message: "invalid username/password.", action: "", data: {} });
            }
        }).catch(err => {
            resp.status(200);
            return resp.send( { status: 200, error: true, message: "Opps! Something went wrong, please try later.", action: "", data: {} });
        });
    };




    public async loginWithOTP(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        const mobile = req.body.mobile;
        const hashCode = req.body.hashCode;
        if (/^(?:\+88|01)?\d{11}\r?$/.test(mobile) === false) {
            resp.status(200);
            return resp.send( { status: 200, error: true, message: "Invalid mobile number.", action: "Re-submit valid mobile number.", data: {} });
        }
        const user = await this.UserProvider.get(mobile);
        if (!user) {
            resp.status(200);
            return resp.send( { status: 200, error: true, message: "No member account found.", action: "Re-submit valid mobile number.", data: {} });
        }
        // send message through SMS gateway here..
        const axios = require('axios').default;
        try {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            await this.UserProvider.createOTPSession(mobile, otp);
            const message: string = encodeURIComponent("<#> Banani Club: Your OTP is " + otp + " .Expired in 5 minutes. " + hashCode);
            const smsRes = await axios.get('http://103.9.185.211/smsSendApi.php?mobile=' + mobile + '&message=' + message + '&cli=CARCOPOLO');
            console.log(smsRes.data);
            console.log("OTP: "+otp);
            resp.status(200);
            return resp.send( { status: 200, error: false, message: "OTP sent successfully.", action: "Confirm OTP login.", data: {} });
        } catch (error) {
            resp.status(200);
            return resp.send( { status: 200, error: true, message: "OTP sending failed. Please try later.", action: "", data: {} });
        }
    };


    public async loginWithOTPConfirm(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        const mobile = req.body.mobile;
        const otp = req.body.otp;
        //TODO: juwel

    }



    /**
     * Login request is submitted to `loginCheck`, it validates login and response with user auth info
     */
    // public async loginCheck(req: HttpRequest, res: HttpResponse, next: NextFunc) {
    //     const mobile = req.body.mobile;
    //     const password = req.body.password;
    //     // validation
    //     if (!mobile || !password) {
    //         this.response.status = 400;
    //         this.response.error = true;
    //         this.response.message = "mobile & password required"
    //         this.response.action = "re-submit valid mobile & password"
    //         this.response.data = null;
    //         res.status(this.response.status);
    //         return res.send(this.response);
    //     }
    //     const user: IUser = await this.UserProvider.get(mobile);
    //     if (!user || !user.isActive || user.password !== this.Authenticator.digestPassword(password)) {
    //         this.response.status = 401;
    //         this.response.error = true;
    //         this.response.message = "invalid mobile or password";
    //         this.response.action = "login";
    //         this.response.data = null;
    //         res.status(this.response.status);
    //         return res.send(this.response);
    //     } else {
    //         const token = jwt.sign({ id: user._id }, APP_CONFIG.authSecret as string, { expiresIn: '30d' });
    //         const refreshToken = crypto.createHmac('sha256', "secret").update(new Date().getTime().toString()).digest('hex');
    //         await this.UserProvider.createSession(mobile, refreshToken);
    //         this.response.status = 200;
    //         this.response.error = false;
    //         this.response.message = "login success";
    //         this.response.action = "dashboard";
    //         this.response.data = {
    //             "fullname": user.name,
    //             "mobile": user.mobile,
    //             "image": user.image,
    //             "accessToken": token,
    //             "refreshToken": refreshToken,
    //             "mediaPath": ""

    //         };
    //         res.status(this.response.status);
    //         return res.send(this.response);
    //     }
    // };



    /**
     * Refresh token request is submitted to `RefreshToken`, it generates new access token
     */
    public async RefreshToken(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        const refreshToken: string = req.body.refreshToken;
        if (refreshToken) {
            const isValid: ISession = await this.UserProvider.checkSession(refreshToken);
            if (isValid) {
                const user: IUser = await this.UserProvider.get(isValid.mobile);
                if (user) {
                    const accessToken = jwt.sign({ id: user._id }, APP_CONFIG.authSecret as string, { expiresIn: '30d' });
                    this.response.status = 200;
                    this.response.error = false;
                    this.response.message = "new access token generated";
                    this.response.action = "Continue";
                    this.response.data = { accessToken };
                    res.status(this.response.status);
                    return res.send(this.response);
                } else {
                    this.response.status = 402;
                    this.response.error = true;
                    this.response.message = "user account does not exist anymore";
                    this.response.action = "opps!";
                    this.response.data = {};
                    res.status(this.response.status);
                    return res.send(this.response);
                }
            } else {
                this.response.status = 401;
                this.response.error = true;
                this.response.message = "login Session Expired / Invalid refreshToken";
                this.response.action = "Login";
                this.response.data = null;
                res.status(this.response.status);
                return res.send(this.response);
            }
        } else {
            this.response.status = 400;
            this.response.error = true;
            this.response.message = "refreshToken required";
            this.response.action = "Re-submit refreshToken";
            this.response.data = null;
            res.status(this.response.status);
            return res.send(this.response);
        }
    };


    /**
     * Send OTP request is submitted to `SendOTP`, it sends a one time password (OTP) for phone number verification
     */
    public async SendOTP(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        const axios = require('axios').default;
        const mobile: string = req.body.mobile;
        const hashCode: string = req.body.hashCode;
        const apiKey: string = req.body.apiKey;
        const otpType: string = req.body.otpType;

        if (!mobile || !hashCode || !apiKey) {
            this.response.status = 400;
            this.response.error = true;
            this.response.message = "mobile, hashCode, apiKey, otpType required";
            this.response.action = "Re-submit mobile, hashCode, apiKey & otpType";
            this.response.data = null;
            res.status(this.response.status);
            return res.send(this.response);
        } else {

            const isUserExists = await this.UserProvider.get(mobile);
            if (!isUserExists) {
                this.response.status = 401;
                this.response.error = true;
                this.response.message = "user not found";
                this.response.action = "signup";
                this.response.data = null;
                res.status(this.response.status);
                return res.send(this.response);
            }

            if (/^(?:\+88|01)?\d{11}\r?$/.test(mobile) === false) {
                this.response.status = 402;
                this.response.error = true;
                this.response.message = "Invalid mobile number";
                this.response.action = "Re-submit valid mobile, hashCode, apiKey";
                this.response.data = null;
                res.status(this.response.status);
                return res.send(this.response);
            } else if (apiKey !== "eidokansmsApi@123test") {
                this.response.status = 403;
                this.response.error = true;
                this.response.message = "Invalid apiKey";
                this.response.action = "Re-submit valid mobile, hashCode, apiKey";
                this.response.data = null;
                res.status(this.response.status);
                return res.send(this.response);
            } else {
                const otp = Math.floor(1000 + Math.random() * 9000).toString();
                await this.UserProvider.createOTPSession(mobile, otp);
                // TODO: send message through SMS gateway here..
                try {
                    const message: string = encodeURIComponent("<#> eiDokan: Your OTP is " + otp + " .Expired in 5 minutes. " + hashCode);
                    const smsRes = await axios.get('http://102.9.186.32/smsSendApi.php?mobile=' + mobile + '&message=' + message + '&cli=CARCOPOLO');
                    console.log(smsRes.data);
                    console.log("OTP: "+otp);
                } catch (error) {
                    console.log("SMS failed");
                }
                this.response.status = 200;
                this.response.error = false;
                this.response.message = "OTP send successfully";
                this.response.action = "verify otp";
                this.response.data = {};
                console.log(this.response);
                res.status(this.response.status);
                return res.send(this.response);
            }
        }

    };


    public async UpdateProfile(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        const fullname: string = req.body.fullname;
        const businessName: string = req.body.businessName;
        const avatar: string = req.body.avatar;
        const nidNo: string = req.body.nidNo;
        const latitude: number = req.body.latitude;
        const longitude: number = req.body.longitude;

        if (!fullname || !businessName || !avatar || !nidNo || !latitude || !longitude) {
            this.response.status = 400;
            this.response.error = true;
            this.response.message = "fullname, businessName, avatar, nidNo, latitude, longitude required";
            this.response.action = "Re-submit valid fullname, businessName, avatar, nidNo, latitude, longitude";
            this.response.data = null;
            res.status(this.response.status);
            return res.send(this.response);
        } else {
            await this.UserProvider.getById(req.userId).then(async user => {
                user.name = fullname;

                await user.save().then(savedUser => {
                    this.response.error = false;
                    this.response.status = 200;
                    this.response.message = "profile updated successfully";
                    this.response.action = "continue";
                    this.response.data = savedUser;
                }).catch(error => {
                    this.response.error = true;
                    this.response.status = 500;
                    this.response.message = "internal server error";
                    this.response.action = "try later";
                    this.response.data = null;
                })
            }).catch(error => {
                this.response.error = true;
                this.response.status = 401;
                this.response.message = "user not found";
                this.response.action = "try again";
                this.response.data = null;
            });
            res.status(this.response.status);
            return res.send(this.response);
        }
    };


    public async UpdatePassword(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        const password: string = req.body.password;
        const confirmPassword: string = req.body.confirmPassword;
        if (!password || !confirmPassword) {
            this.response.status = 400;
            this.response.error = true;
            this.response.message = "password & confirmPassword required";
            this.response.action = "Re-submit password & confirmPassword";
            this.response.data = null;
            res.status(this.response.status);
            return res.send(this.response);
        } else if (password.length < 6) {
            this.response.status = 401;
            this.response.error = true;
            this.response.message = "password must be minimum 6 character";
            this.response.action = "Re-submit valid password & confirmPassword";
            this.response.data = null;
            res.status(this.response.status);
            return res.send(this.response);
        }
        else if (password !== confirmPassword) {
            this.response.status = 402;
            this.response.error = true;
            this.response.message = "password & confirmPassword not matched";
            this.response.action = "Re-submit password & confirmPassword";
            this.response.data = null;
            res.status(this.response.status);
            return res.send(this.response);
        }
        else {
            await this.UserProvider.getById(req.userId).then(async user => {
                user.password = this.Authenticator.digestPassword(password);
                await user.save().then(savedUser => {
                    this.response.error = false;
                    this.response.status = 200;
                    this.response.message = "password updated successfully";
                    this.response.action = "continue";
                    this.response.data = null;
                }).catch(error => {
                    this.response.error = true;
                    this.response.status = 500;
                    this.response.message = "internal server error";
                    this.response.action = "try later";
                    this.response.data = null;
                })
            }).catch(error => {
                this.response.error = true;
                this.response.status = 403;
                this.response.message = "user not found";
                this.response.action = "try again";
                this.response.data = null;
            });

            res.status(this.response.status);
            return res.send(this.response);
        }
    };



    public async ResetPassword(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        const mobile: string = req.body.mobile;
        const otp: string = req.body.otp;
        const newPassword: string = req.body.newPassword;
        const confirmNewPassword: string = req.body.confirmNewPassword;

        if (!otp || !mobile || !newPassword || !confirmNewPassword) {
            this.response.status = 400;
            this.response.error = true;
            this.response.message = "password, confirmPassword, mobile & otp required";
            this.response.action = "Re-submit password & confirmPassword";
            this.response.data = null;
            res.status(this.response.status);
            return res.send(this.response);
        } else if (newPassword.length < 6) {
            this.response.status = 401;
            this.response.error = true;
            this.response.message = "password must be minimum 6 character";
            this.response.action = "Re-submit valid password & confirmPassword";
            this.response.data = null;
            res.status(this.response.status);
            return res.send(this.response);
        }
        else if (newPassword !== confirmNewPassword) {
            this.response.status = 402;
            this.response.error = true;
            this.response.message = "password & confirmPassword not matched";
            this.response.action = "Re-submit password & confirmPassword";
            this.response.data = null;
            res.status(this.response.status);
            return res.send(this.response);
        }
        else {

            const isValidOTP = await this.UserProvider.checkOTPSession(mobile, otp);
            if (!isValidOTP) {
                this.response.error = true;
                this.response.status = 404;
                this.response.message = "invalid otp";
                this.response.action = "try again";
                this.response.data = null;
                res.status(this.response.status);
                return res.send(this.response);
            }

            await this.UserProvider.get(mobile).then(async user => {
                user.password = this.Authenticator.digestPassword(newPassword);
                await user.save().then(async savedUser => {
                    this.response.error = false;
                    this.response.status = 200;
                    this.response.message = "password reset successfully";
                    this.response.action = "continue";
                    this.response.data = null;
                    // delete user old otp
                    await this.UserProvider.removeOTPSession(mobile);
                }).catch(error => {
                    this.response.error = true;
                    this.response.status = 500;
                    this.response.message = "internal server error";
                    this.response.action = "try later";
                    this.response.data = null;
                })
            }).catch(error => {
                this.response.error = true;
                this.response.status = 403;
                this.response.message = "user not found";
                this.response.action = "try again";
                this.response.data = null;
            });

            res.status(this.response.status);
            return res.send(this.response);
        }
    };






}