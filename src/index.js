import dotenv from "dotenv";
import connectToDb from "./db/connectToDb.js";
import { app } from "./app.js";

dotenv.config({
  // path is the path where our .env file is located
  // (not necessary to give because we mostly put .env in root and it take path as root by default)
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

connectToDb()
  .then(() => {
    // listening for error in the database
    app.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });
    // using the 'app' created here to run the express server
    app.listen(PORT, () => {
      console.log("server is running at port:", PORT);
    });
  })
  .catch((error) => {
    console.log("Mongo DB connection failed", error);
  });

// ; (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//         app.on('error',(error)=>{
//             console.log('Error',error);
//             throw error
//         })

//         app.listen(PORT,()=>{
//             console.log('server connected');
//         })
//     } catch (error) {
//         console.log("Error:", error);
//         throw error
//     }
// })()
