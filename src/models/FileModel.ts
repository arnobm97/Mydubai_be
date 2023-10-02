import mongoose, { Schema } from "mongoose";
import { IFile } from "../core/IFileProvider";

const FileSchema: Schema = new Schema({
    folderId:{ type: String, required: true },
    location:{ type: String, required: true },
    fileName:{ type: String },
    createBy: {
      id: { type: String, required: true },
      fullName: { type: String, required: true },
    }
}, { timestamps: true });

export default mongoose.model<IFile>("files", FileSchema);