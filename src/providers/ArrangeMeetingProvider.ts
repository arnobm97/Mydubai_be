// import UserModel from "../models/UserModel";
import {IArrangeMeetingProvider, IArrangeMeeting, IArrangeMeetingPage, IOrganizer} from "../core/IArrangeMeetingProvider";
import ArrangeMeetingModel from "../models/ArrangeMeetingModel";


export class ArrangeMeetingProvider implements IArrangeMeetingProvider {

    public async get(id: string): Promise<IArrangeMeeting> {
        return await ArrangeMeetingModel.findOne({"_id": id }).catch(err => null);
    }

    public async list(page:number = 1, size:number = 10): Promise<IArrangeMeetingPage> {
        let pageSize : number;
        const count: number = await ArrangeMeetingModel.find().countDocuments();
        let query;
        if(page === 0){
            pageSize = count;
            query = await ArrangeMeetingModel.find().catch(err => null);
        }else{
            pageSize = size;
            query = await ArrangeMeetingModel.find().skip(size * (page - 1)).limit(size).catch(err => null);
        }
        return { size: pageSize, page, count, data: query };
    }

    public async create(phoneCall: boolean, videoCall: boolean, zoom: boolean, googleMeet: boolean, meetingDate: string, meetingTime: string, timeZone: string, organizer: IOrganizer, guestEmails: []): Promise<IArrangeMeeting> {
        return await ArrangeMeetingModel.create({
            phoneCall,
            videoCall,
            zoom,
            googleMeet,
            meetingDate,
            meetingTime,
            timeZone,
            organizer,
            guestEmails
        });
    }

    public async delete(id: string): Promise<any> {
        return await ArrangeMeetingModel.findByIdAndDelete(id);
    }


}