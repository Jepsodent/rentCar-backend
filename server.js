import express from "express";
import 'dotenv/config';
import connectDB from "./configs/db.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import adminRoute from "./routes/adminRoute.js";
import carRoute from "./routes/carRoute.js";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();
const PORT = 4000;

await connectDB();
await connectCloudinary();


app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send("API IS WORKING");
})

app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/car', carRoute);

app.listen(PORT, () => console.log(`Server Running at  http://localhost:${PORT}`));

