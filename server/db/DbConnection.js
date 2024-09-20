import mongoose from "mongoose";

export async function connecToDb(){
    try {
         await mongoose.connect(process.env.MONGO_URI)
         console.log("Datebase connected");
    } catch (error) {
        console.log(error.message);
    }
}