import express from "express"
import dotenv from "dotenv";
import { connecToDb } from "./db/DbConnection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from 'cloudinary';
import product from "./routes/products.js"
const app = express();

dotenv.config();
const corsOptions = {
    origin: process.env.CLIENT_URL||"http://localhost:5173",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_SECRET_KEY
});
console.log(process.env.CLOUD_NAME);

app.use("/api/v1",product)
connecToDb()
const port = process.env.PORT ||3000
app.listen(port,()=>{
    console.log("Server running at port 3000");
})
