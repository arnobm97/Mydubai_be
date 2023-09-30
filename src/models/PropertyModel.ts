import mongoose, { Schema } from "mongoose";
import { IProperty } from "../core/IPropertyProvider";

const PropertySchema: Schema = new Schema({
    propertyNo:{ type: Number, required: true },
    lang:{ type: String, required: true },
    propertyName:{ type: String, required: true },
    propertyDescription:{ type: String, required: true },
    propertyType: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    propertyArea: {
      id: { type: String, required: true },
      areaName: { type: String, required: true },
    },
    developmentType: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    developerType: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    areaSize:{ type: String, required: true },
    highlights:{ type: Object, required: true },
    tag:{ type: String, required: true, default: null },
    amenities: {
      description: { type: String, required: true },
      features: { type: Object, required: true },
    },
    completion:{ type: String, required: true },
    startingPrice:{ type: Number, required: true },

    location: {
      locDescription: { type: String, required: true },
      position: { type: [Number], required: true },
      nearby: [{
        _id: false,
        title: { type: String, required: true },
        icon: { type: String, required: true },
        position: { type: [Number], required: true },
      }]
    },
    paymentPlan: [{
      _id: false,
      milestone: { type: String, required: true },
      installment: { type: Number, required: true },
      percentage: { type: String, required: true },
      date: { type: Date, required: true },
      notes: { type: String, required: true }
    }],
    unitType : {
      title: { type: String, required: true },
      count: { type: String, required: true },
      size: { type: String, required: true }
    },

    brochure: { type: String, required: true },
    images: [{
      _id: false,
      type: { type: String, required: true },
      metaDescription: { type: String, required: true },
      path: { type: String, required: true },
    }],

    videos: [{
      _id: false,
      type: { type: String, required: true },
      path: { type: String, required: true },
    }],
    isFeatured: { type: Boolean, default: false },
    createBy: {
      id: { type: String, required: true },
      fullName: { type: String, required: true },
    }


}, { timestamps: true });

// PropertySchema.set('toJSON', { virtuals: true});

export default mongoose.model<IProperty>("properties", PropertySchema);