import { Controller } from "../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../core/Types";
import { IPropertyProvider, IProperty, EmbededProperty } from "../../core/IPropertyProvider";
import { ICustomerInterestProvider, ICustomerInterest } from "../../core/ICustomerInterestProvider";
import { IArrangeMeetingProvider, IArrangeMeeting, IArrangeMeetingPage, IOrganizer } from "../../core/IArrangeMeetingProvider";

export class CustomerInterestApiController extends Controller {

    private config = require("../../../config.json");
    private response = { status: 200, error: false, message: "", data: {} };

    private CustomerInterestProvider: ICustomerInterestProvider;
    private ArrangeMeetingProvider: IArrangeMeetingProvider;
    private PropertyProvider: IPropertyProvider;


    public onRegister(): void {
        this.onPost("/api/v1/submit-customer-interest/:propertyNo", this.storeCustomerInterest);
        this.onPost("/api/v1/submit-arrange-meeting", this.arrangeMeeting);
    }

    public async storeCustomerInterest(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        const propertyNo: number = parseInt(req.params.propertyNo,10);
        const name: string = req.body.name;
        const email: string = req.body.email;
        const phone: string = req.body.phone;
        const preferedLang: string = req.body.preferedLang;
        const description: string = req.body.description;
        if(!propertyNo || !name || !email || !phone || !preferedLang || !description){
            this.response.status = 403;
            this.response.error = true,
            this.response.message = "propertyNo, name, email, phone, preferedLang, description is required.";
            return res.status(this.response.status).send(this.response);
        }
        const property : IProperty = await this.PropertyProvider.get(propertyNo, 'en');
        if(!property){
            this.response.status = 403;
            this.response.error = true,
            this.response.message = "Invalid propertyNo no.";
            return res.status(this.response.status).send(this.response);
        }
        const embadedProperty: EmbededProperty = {propertyNo: property.propertyNo, name: property.propertyName };

        try{
            const isSaved = await this.CustomerInterestProvider.create(embadedProperty, name, email, phone, preferedLang, description);
            this.response.status = 200;
            this.response.error = false,
            this.response.message = "Customer interest submitted successfully.";
            return res.status(this.response.status).send(this.response);
        }catch(err){
            this.response.status = 500;
            this.response.error = true,
            this.response.message = "Internal server error, please try later.";
            return res.status(this.response.status).send(this.response);
        }
    }


    public async arrangeMeeting(req: HttpRequest, res: HttpResponse, next: NextFunc) {
        const phoneCall: boolean = req.body.phoneCall;
        const videoCall: boolean = req.body.videoCall;
        const zoom: boolean = req.body.zoom;
        const googleMeet: boolean = req.body.googleMeet;
        const meetingDate: string = req.body.meetingDate;
        const meetingTime: string = req.body.meetingTime;
        const timeZone: string = req.body.timeZone;
        const organizer: IOrganizer = req.body.organizer;
        const guestEmails: [] = req.body.guestEmails;

        //return res.send(req.body);
        
        if(!meetingDate || !meetingTime || !timeZone || !organizer || !guestEmails){
            this.response.status = 403;
            this.response.error = true,
            this.response.message = "phoneCall, videoCall, zoom, googleMeet, meetingDate, meetingTime, timeZone, organizer and guestEmails is required.";
            return res.status(this.response.status).send(this.response);
        }
        try{
            const isSaved = await this.ArrangeMeetingProvider.create(phoneCall,videoCall,zoom,googleMeet,meetingDate,meetingTime,timeZone,organizer,guestEmails);
            this.response.status = 200;
            this.response.error = false,
            this.response.message = "Arrange meeting request submitted successfully.";
            return res.status(this.response.status).send(this.response);
        }catch(error){
            console.log(error);
            this.response.status = 500;
            this.response.error = true,
            this.response.message = "Internal server error, please try later.";
            return res.status(this.response.status).send(this.response);
        }
    }



}