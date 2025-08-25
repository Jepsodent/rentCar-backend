
// userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
// carId: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Car'},
// pickupDate: {type: Date, required:true},
// returnDate: {type: Date, required: true},
// totalPrice: {type: Number},
// paymentStatus: {type: Boolean, required: true, default: false},

import Rental from "../models/Rental.js";
import Car from "../models/Car.js"

// POST /api/rent/car 
export const rentCar = async (req, res) => {
    try {
        const {userId} = req;
        const {carId, pickupDate, returnDate} = req.body;
        if(!carId || !pickupDate || !returnDate){
            return res.status(400).json({success:false, message: "Invalid Data"});
        }

        const pickUp = new Date(pickupDate);
        const returning = new Date(returnDate);

        if(pickUp >= returning){
            return res.status(400).json({success:false, message: "Return date must be after pickup date"})
        };
        
        const car = await Car.findById(carId);
        if(!car){
            return res.status(404).json({success:false, message:"Car not found"});
        }

        const isCarBooked = await Rental.findOne({
            carId,
            $and: [
                {pickupDate: {$lt: returning}},
                {returnDate: {$gt: pickUp}}
            ]
        })

        if(isCarBooked){
            return res.status(404).json({success:false, message: "Car is not available in selected date range"});
        }

        
        const durationIndays = (returning - pickUp) / (1000 * 60 * 60 * 24);
        const totalPrice = durationIndays * car.pricePerDay;


        await Rental.create({
            userId,
            carId,
            pickupDate: pickUp,
            returnDate: returning,
            totalPrice,
            paymentStatus: false,
        });
        
        //cape update status nya nanti
        // await Car.findByIdAndUpdate(carId, {status: "rented"});

        return res.status(200).json({success:true, message:"Rental created successfully"});
    } catch (error) {
        return res.status(500).json({success:false, message:error.message});
    }
}


// GET//api/rent/user
export const getUserRental = async (req, res) => {
    try {
        const {userId} = req;
        const rentals = await Rental.find({userId}).populate("carId");
        return res.status(200).json({success:true, rentals});
    } catch (error) {
        res.status(500).json({success:false, message: error.message});
    }
}


// get all rental for admin : GET /api/rent/admin

export const getAllRental = async (req, res) => {
    try {
        const rentals = await Rental.find({}).populate("userId carId ");
        res.status(200).json({success:true, rentals});
    } catch (error) {
        res.status(500).json({success:false, message: error.message});        
    }
}

// DELETE /api/rent/:id
export const cancelRental = async (req, res ) => {
    try {
        const {userId} = req;
        const {id} = req.params;
        if(!id){
            return res.status(400).json({success:false, message:"Rental ID is missing"});
        }
        const rental = await Rental.findOne({_id: id, userId});
        if(!rental){
            return res.status(404).json({success:false, message: "Rental is not found"});
        }
        if(rental.status !== 'active'){
            return res.status(409).json({success:false, message: "This Rental is already inactive"});
        }

        const updatedRental = await Rental.findByIdAndUpdate(id, {status: "canceled"});
        await Car.findByIdAndUpdate(updatedRental.carId, {status: 'available'}, {new: true, runValidators: true});

        res.status(200).json({success:true, message: "Status Updated"});
    } catch (error) {
        res.status(500).json({success:false , message: error.message});
    }
}
