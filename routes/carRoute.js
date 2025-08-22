import express from "express";
import { addCar, deleteCar, getAllCars, getCarDetails, updateCar } from "../controllers/carController.js";
const carRoute = express.Router();
import { upload } from "../configs/multer.js";
import adminAuth from "../middleware/authAdmin.js";

// /api/car/add -> Protected Admin Route;
carRoute.post('/add', adminAuth, upload.array('images'),   addCar);

// /api/car/list
carRoute.get('/list', getAllCars);

// /api/car/list/:id
carRoute.get('/list/:id', getCarDetails);

// /api/car/delete/:id
carRoute.delete('/delete/:id',adminAuth, deleteCar);

// /api/car/update/:id
carRoute.put('/update/:id',adminAuth, upload.array('images'), updateCar);

export default carRoute;

