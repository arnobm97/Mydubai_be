import mongoose, { Schema } from "mongoose";
import { IPropertyType } from "../core/IPropertyTypeProvider";


const PropertyTypeSchema: Schema = new Schema({
    name:{ type: String, required: true },
    lang:{ type: String, required: true },
    createdBy: {
      id: { type: String, required: true },
      fullName: { type: String, required: true },
    }
}, { timestamps: true });


export default mongoose.model<IPropertyType>("property-types", PropertyTypeSchema);