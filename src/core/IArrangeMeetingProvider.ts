import { EmbededProperty } from "./IPropertyProvider";
import { Document } from "mongoose";

export interface IOrganizer {
    name: string;
    phoneNumber: string;
    email: string;
}

export interface IArrangeMeeting extends Document{
    phoneCall: boolean;
    videoCall: boolean;
    zoom: boolean;
    googleMeet: boolean;
    meetingDate: string;
    meetingTime: string;
    timeZone: string;
    organizer: IOrganizer;
    guestEmails: [];
}

export interface IArrangeMeetingPage {
    size: number,
    page: number,
    count: number,
    data: IArrangeMeeting[]
}

export interface IArrangeMeetingProvider {
    get(id: string): Promise<IArrangeMeeting>;
    list(page:number, size:number): Promise<IArrangeMeetingPage>;
    create(phoneCall: boolean, videoCall: boolean, zoom: boolean, googleMeet: boolean, meetingDate: string, meetingTime: string, timeZone: string, organizer: IOrganizer, guestEmails: [] ): Promise<IArrangeMeeting>;
    delete(id: string): Promise<any>;
}