import mongoose from "mongoose";


const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("DB Connect"));
        await mongoose.connect(`${process.env.MONGODB_URI}/rentcar`);
    } catch (error) {
        console.error(error.message);
    }    
}

export default connectDB;