import express from "express";
import dotenv from "dotenv";
import connectToDb from "./db/connectToDb.js";

dotenv.config({
    path:'./env'
})

const app = express()
const PORT = process.env.PORT

connectToDb()



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