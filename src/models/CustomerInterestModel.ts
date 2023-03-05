import mongoose, { Schema } from "mongoose";
import { ICustomerInterest } from "../core/ICustomerInterestProvider";

const CustomerInterestSchema: Schema = new Schema({
  property: {
      propertyNo: { type: Number, required: true },
      name: { type: String, required: true },
    },
    name:{ type: String, required: true },
    email:{ type: String, required: true },
    phone:{ type: String, required: true },
    preferedLang:{ type: String, required: true },
    description:{ type: String, required: true }


}, { timestamps: true });

export default mongoose.model<ICustomerInterest>("customer-interests", CustomerInterestSchema);