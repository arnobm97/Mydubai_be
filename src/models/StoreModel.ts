import { IStore } from "../core/IStoreProvider";
import mongoose, { Schema } from "mongoose";

const StoreSchema: Schema = new Schema({
  name: { type: String, required: true }
}, { timestamps: true });

StoreSchema.set('toJSON', { virtuals: true});
StoreSchema.index({ name: "text" }, { unique: true } );
export default mongoose.model<IStore>("stores", StoreSchema);



