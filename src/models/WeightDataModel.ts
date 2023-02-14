import mongoose, { Schema } from "mongoose";
import { IVehicleWeightData,IWeightUnits,IChallanTypes } from "../core/IWeightDataProvider";

const VehicleWeightDataSchema: Schema = new Schema({
    serialNo:{ type: String, required: true },
    vehicleNo:{ type: String, required: true },
    driverName:{ type: String, required: false, default: null },
    stationId:{ type: String, required: true },
    weightData: [{
      _id: false,
      time: { type: Date, required: true },
      weight: { type: Number, required: true },
      unit: { type: IWeightUnits, required: true },
      challan: {
        type: {
          party: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            address: { type: String, required: true },
          },
          section: { type: String, required: true },
          tare: { type: String, required: false, default : null },
          challanNo: { type: String, required: true },
          lCNo: { type: String, required: true },
          challanType: { type: IChallanTypes, required: true },
          products: [{
            _id: false,
            id: { type: String, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, required: false, default: null },
          }]
        },
        default : null
      },
      user: {
        id: { type: String, required: true },
        fullName: { type: String, required: true },
      },
      updatedBy: {
        id: { type: String, required: false, default: null },
        fullName: { type: String, required: false,  default: null },
      },
      flag: { type: Number, required: false, default: 0 },
    }],
    flag:{ type: Number, required: false, default: 0 }


}, { timestamps: true });

VehicleWeightDataSchema.set('toJSON', { virtuals: true});

export default mongoose.model<IVehicleWeightData>("vehicle_weights", VehicleWeightDataSchema);