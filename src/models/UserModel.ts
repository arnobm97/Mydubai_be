import { IUser, Role, MembershipType, Department, Club } from "../core/IUserProvider";
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Role, required: true },
    membershipType: {type: MembershipType, required: true },
    department: {type: Department, required: true },
    image: { type: String, required: true },
    club: {type: Club, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IUser>("User", UserSchema);