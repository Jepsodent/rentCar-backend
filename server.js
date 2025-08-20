import express from "express";
import 'dotenv/config';
import connectDB from "./configs/db.js";

const app = express();
const PORT = 4000;

await connectDB();

app.use(express.json());
app.get('/', (req, res) => {
    res.send("API IS WORKING");
})
app.post('/test', (req, res) => {
    const{ name, password}= req.body;
    console.log(name, password);
    res.json({success:true, message: {name , password}});
})


app.listen(PORT, () => console.log(`Server Running at  http://localhost:${PORT}`));

