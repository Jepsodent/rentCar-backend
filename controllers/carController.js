import {v2 as cloudinary} from "cloudinary";
import Car from "../models/Car.js";


//POST //api/car/add
export const addCar = async (req , res) => {
    try {
        let carData = JSON.parse(req.body.carData);
        const images =req.files

        if(!images || images.length === 0 ){
            return res.json({success:false, message:"Please upload image"});
        }

        carData.year = parseInt(carData.year);
        carData.totalSeat = parseInt(carData.totalSeat);
        carData.pricePerDay = parseInt(carData.pricePerDay);

        let imageUrl = await Promise.all(
            images.map(async (image) => {
                let result = await cloudinary.uploader.upload(image.path, {
                    resource_type: 'image'
                });
                return {
                    url: result.secure_url,
                    public_id: result.public_id
                };
            })
        );
        await Car.create({
            ...carData,
            images: imageUrl
        })
        res.status(201).json({success:true , message: "Success add Car"});
        
    } catch (error) {
        res.status(500).json({success:false , message: error.message});
        
    }
}

//get //api/car/list/
export const getAllCars = async (req, res) => {
    try {
        const data = await Car.find({});
        res.status(200).json({success:true, car: data});
    } catch (error) {
        res.status(500).json({success:false, message: error.message});
    }
}


//get /api/car/list/:id
export const getCarDetails = async (req, res) => {
    const {id} = req.params;
    try {
        const carData = await Car.findById(id);
        if(!carData){
            return res.json({success:false , message: "Invalid ID"});
        } 
        res.status(200).json({success:true, car: carData});
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
        
    }
}


// 
export const updateCar = async (req, res) => {
    try {
        const carData = JSON.parse(req.body.carData);
        const {id} = req.params;
        const images = req.files;
        if(!id){
            return res.status(400).json({ success: false, message: "ID is not found" });
        }
        const oldCar = await Car.findById(id);

        if(!oldCar){
            return res.status(404).json({ success: false, message: "Car not found" });
        }

        let uploadImage = oldCar.images;

        if(images && images.length > 0) {
            if(oldCar.images.length > 0){
                // hapus semua gambar lama
                await Promise.all(
                    oldCar.images.map(async (image) => {
                        await cloudinary.uploader.destroy(image.public_id);
                    })
                );
            }
            uploadImage = await Promise.all(
                images.map(async (image) => {
                    const result = await cloudinary.uploader.upload(image.path, {resource_type: 'image'});

                    return {
                        url: result.secure_url,
                        public_id: result.public_id
                    }
                })
            );
        }
        

        carData.year = parseInt(carData.year);
        carData.totalSeat = parseInt(carData.totalSeat);
        carData.pricePerDay = parseInt(carData.pricePerDay);   

        const updateData = {
            ...carData,
            images: uploadImage
        }

        await Car.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});
        res.status(200).json({success:true , message: "Car Details Updated"});
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
}

// /api/car/delete/:id
export const deleteCar = async (req, res) => {
    const {id} = req.params;
    try {
        if(!id) {
            return res.status(400).json({success:false, message: "ID is not found"})
        }
        const car = await Car.findById(id);
        if(!car){
            return res.status(404).json({ success: false, message: "Car not found" });
        }
        if(car.images && car.images.length > 0 ){
            await Promise.all(
                car.images.map(async (image) => {
                    await cloudinary.uploader.destroy(image.public_id);
                })
            )
        };

        await car.deleteOne();
        res.status(200).json({success:true, message:"Car Deleted"});
    } catch (error) {
        res.status(400).json({success:false, message:error.message});
    }
}
