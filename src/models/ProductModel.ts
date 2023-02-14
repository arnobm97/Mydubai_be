import { IProduct } from "../core/IProductProvider";
import mongoose, { Schema } from "mongoose";

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  unit: { type: String, required: false, default: null },
}, { timestamps: true });

ProductSchema.set('toJSON', { virtuals: true});
ProductSchema.index({ name: "text" }, { unique: true } );

export default mongoose.model<IProduct>("products", ProductSchema);