import { IVendor } from "../core/IVendorProvider";
import mongoose, { Schema } from "mongoose";

const VendorSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: false, default: null },
}, { timestamps: true });

VendorSchema.set('toJSON', { virtuals: true});
VendorSchema.index({ name: "text" }, { unique: true } );

export default mongoose.model<IVendor>("vendors", VendorSchema);



