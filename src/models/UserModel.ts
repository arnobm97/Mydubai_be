import { IUser, Role } from "../core/IUserProvider";
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema({
    fullName: { type: String, required: false },
    email:{ type: String, required: true },
    password: { type: String, required: false },
    avatar: { type: String, required: false, default: null },
    role: { type: String, required: true, default: Role.User },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

UserSchema.index({ email: "text" }, { unique: true } );
export default mongoose.model<IUser>("Users", UserSchema);