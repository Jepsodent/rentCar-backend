import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    carId: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Car'},
    pickupDate: {type: Date, required:true},
    returnDate: {type: Date, required: true},
    totalPrice: {type: Number},
    paymentStatus: {type: Boolean, required: true, default: false},
    status: {type: String, enum: ['active', 'canceled', 'completed'], default: 'active'}
}, {timestamps: true});


const Rental = mongoose.models.Rental || mongoose.model("Rental", rentalSchema);
export default Rental;


