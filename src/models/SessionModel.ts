import { ISession } from "../core/IUserProvider";
import mongoose, { Schema } from "mongoose";

const SessionSchema: Schema = new Schema({
    username:{ type: String, required: true },
    refreshToken: { type: String, required: true },
}, { timestamps: true });

SessionSchema.index({ username: "text" }, { unique: true } );

export default mongoose.model<ISession>("sessions", SessionSchema);