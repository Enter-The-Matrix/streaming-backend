import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectToDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Mongo DB connected:", connectionInstance.connection.host);
  } catch (error) {
    console.log("(inside connectToDb.js)Mongo DB connection failed:", error);
    //  process is a global object that provides information and control over the current Node.js process.
    //  You don't need to import or require it as it is available globally.
    process.exit(1);
  }
};

export default connectToDb;
