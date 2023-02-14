import { ICategory } from "../core/ICategoryProvider";
import mongoose, { Schema } from "mongoose";
const CategorySchema: Schema = new Schema({

  name: { type: String, required: true },
  parent: { type: String, required: false, default: null },
  slug: { type: String, required: true },
  ancestors: { type: [], required: false },
  // ancestors: [{                                       // Only valid for checkpoints with multiple tasks
  //   _id: { type: String, required: true },
  //   name: { type: Number, required: true },
  //   slug: { type: Number, required: true }
  // }]

}, { timestamps: true });

export default mongoose.model<ICategory>("categories", CategorySchema);