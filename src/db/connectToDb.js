import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

 const connectToDb = async()=>{
    try {
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI} /${DB_NAME}`)
        console.log("Mongo DB connected:",connectionInstance.connection.host);
    } catch (error) {
        console.log('Mongo DB connection error:',error);
        process.exit(1)
    }
}

export default connectToDb