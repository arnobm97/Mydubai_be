import mongoose, { Schema } from "mongoose";
import { IArrangeMeeting } from "../core/IArrangeMeetingProvider";

const ArrangeMeetingModelSchema: Schema = new Schema({
  phoneCall :{ type: Boolean, default: false },
  videoCall :{ type: Boolean, default: false },
  zoom :{ type: Boolean, default: false },
  googleMeet :{ type: Boolean, default: false },
  meetingDate :{ type: String, required: true },
  meetingTime :{ type: String, required: true },
  timeZone :{ type: String, required: true },
  organizer: {
      name: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
  },
  guestEmails: { type: Array, required: true }
}, { timestamps: true });

export default mongoose.model<IArrangeMeeting>("arrange-meetings", ArrangeMeetingModelSchema);