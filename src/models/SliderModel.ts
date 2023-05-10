import mongoose, { Schema } from "mongoose";
import { ISlider } from "../core/ISliderProvider";


const SliderSchema: Schema = new Schema({
    lang:{ type: String, required: true },
    title:{ type: String, required: true },
    description1:{ type: String, required: false },
    description2:{ type: String, required: false },
    description3:{ type: String, required: false },
    targetLink:{ type: String, required: false },
    image:{ type: String, required: true },
    createdBy: {
      id: { type: String, required: true },
      fullName: { type: String, required: true },
    }
}, { timestamps: true });


export default mongoose.model<ISlider>("sliders", SliderSchema);