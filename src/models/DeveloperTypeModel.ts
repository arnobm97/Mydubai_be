import mongoose, { Schema } from "mongoose";
import { IDeveloperType } from "../core/IDeveloperTypeProvider";


const DeveloperTypeSchema: Schema = new Schema({
    name:{ type: String, required: true },
    lang:{ type: String, required: true },
    description:{ type: String, required: true, default: null },
    logo:{ type: String, required: true,  default: null },
    createdBy: {
      id: { type: String, required: true },
      fullName: { type: String, required: true },
    }
}, { timestamps: true });


export default mongoose.model<IDeveloperType>("developer-types", DeveloperTypeSchema);