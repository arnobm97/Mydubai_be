import mongoose, { Schema } from "mongoose";
import { IArrangeMeeting } from "../core/IArrangeMeetingProvider";

const ArrangeMeetingModelSchema: Schema = new Schema({
  phoneCall :{ type: Boolean, required: true },
  videoCall :{ type: Boolean, required: true },
  zoom :{ type: Boolean, required: true },
  googleMeet :{ type: Boolean, required: true },
  meetingDate :{ type: String, required: true },
  meetingTime :{ type: String, required: true },
  timeZone :{ type: String, required: true },
  organizer: {
      name: { type: Number, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
  },
  guestEmails: { type: Array, required: true }
}, { timestamps: true });

export default mongoose.model<IArrangeMeeting>("arrange-meetings", ArrangeMeetingModelSchema);