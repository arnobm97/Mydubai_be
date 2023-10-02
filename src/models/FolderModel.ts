import mongoose, { Schema } from "mongoose";
import { IFolder } from "../core/IFolderProvider";

const FolderSchema: Schema = new Schema({
    folderName:{ type: String, required: true },
    remarks:{ type: String },
    createBy: {
      id: { type: String, required: true },
      fullName: { type: String, required: true },
    }
}, { timestamps: true });

export default mongoose.model<IFolder>("folders", FolderSchema);