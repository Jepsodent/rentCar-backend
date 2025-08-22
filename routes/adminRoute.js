import express from "express";
import { isAdmin , adminLogin, adminLogout } from "../controllers/adminController.js";
import adminAuth from "../middleware/authAdmin.js";


const adminRoute = express.Router();
// /api/admin/ route
// /api/admin/login
adminRoute.post('/login', adminLogin);

// /api/admin/logout
adminRoute.get('/logout', adminLogout);

// /api/admin/is-auth
adminRoute.get('/is-auth',adminAuth, isAdmin);


export default adminRoute;