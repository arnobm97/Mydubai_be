import mongoose, { Schema } from "mongoose";
import { IPropertyArea } from "../core/IPropertyAreaProvider";


const PropertyAreaSchema: Schema = new Schema({
    areaName:{ type: String, required: true },
    lang:{ type: String, required: true },
    areaDescription:{ type: String, required: true },
    areaThumbnail:{ type: String, required: true },
    createdBy: {
      id: { type: String, required: true },
      fullName: { type: String, required: true },
    }
}, { timestamps: true });


export default mongoose.model<IPropertyArea>("property-areas", PropertyAreaSchema);