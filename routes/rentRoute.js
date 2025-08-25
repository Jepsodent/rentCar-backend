import express from "express";
import authUser from "../middleware/authUser.js";
import { cancelRental, getAllRental, getUserRental, rentCar } from "../controllers/rentController.js";
import adminAuth from "../middleware/authAdmin.js";

const rentRoute = express.Router();
// POST /api/rent/car 
rentRoute.post("/car", authUser, rentCar);

// GET//api/rent/user
rentRoute.get("/user", authUser, getUserRental);

// DELETE /api/rent/:id
rentRoute.delete("/:id", authUser, cancelRental);

//getAllRental admin  : GET /api/rent/admin
rentRoute.get('/admin', adminAuth, getAllRental);

export default rentRoute;