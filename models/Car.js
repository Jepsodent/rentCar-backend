import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    licensePlate: { type: String, required: true, unique: true },
    totalSeat: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "rented", "under_maintenance", "unavailable"],
      default: "available",
    },
    image: { type: [String]},
  },
  { timestamps: true }
);

const Car = mongoose.models.Car || mongoose.model("Car", carSchema);
export default Car;
