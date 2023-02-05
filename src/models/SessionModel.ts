import { ISession } from "../core/IUserProvider";
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema({
    mobile:{ type: String, required: true, unique: true },
    refreshToken: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ISession>("sessions", UserSchema);