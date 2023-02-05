import { IOtp } from "../core/IUserProvider";
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema({
    mobile:{ type: String, required: true, unique: true },
    otp: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IOtp>("otps", UserSchema);