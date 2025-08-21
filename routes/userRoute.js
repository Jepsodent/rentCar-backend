import express from "express";
import { isAuth, login, logout, register } from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";



const userRoute = express.Router();

userRoute.post('/register', register);
userRoute.post('/login', login);
userRoute.get('/logout', logout);
userRoute.get('/is-auth', authUser, isAuth);



export default userRoute;

