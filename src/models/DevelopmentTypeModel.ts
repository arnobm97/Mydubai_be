import mongoose, { Schema } from "mongoose";
import { IDevelopmentType } from "../core/IDevelopmentTypeProvider";


const DevelopmentTypeSchema: Schema = new Schema({
    name:{ type: String, required: true },
    createdBy: {
      id: { type: String, required: true },
      fullName: { type: String, required: true },
    }
}, { timestamps: true });


export default mongoose.model<IDevelopmentType>("development-types", DevelopmentTypeSchema);