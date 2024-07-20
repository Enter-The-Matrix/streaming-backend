import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// created the express server
const app = express();

//This middleware is used for configuring cors settings
app.use(
  cors({
    // from where our backend can be accessed
    origin: process.env.CORS_ORIGIN,
    // The credentials: true option in the cors middleware configuration allows the server
    // to accept and handle credentials in cross-origin requests. This includes cookies,
    // authorization headers, or TLS client certificates.
    credentials: true,
  })
);

//This middleware is used to parse incoming requests with JSON payloads
app.use(
  express.json({
    // to set the limit of the json payload that backend can accept
    limit: "16kb",
  })
);

// This middleware is particularly useful for handling
// form submissions where the form data is sent in a URL-encoded format
app.use(
  express.urlencoded({
    // to be able to send nested objects
    extended: true,
    // to set the limit of the payload that backend can accept
    limit: "16kb",
  })
);

//This middleware is used to serve static files such as images, CSS files, and JavaScript files
app.use(express.static("public"));

// this middleware is used to parse and handle cookies. It provides functionality
//  to easily read and manipulate cookies sent by the client in the Cookie header.
app.use(cookieParser());

//routes import
import userRouter  from './routes/user.routes.js'


//routes declaration

app.use('/api/v1/users/',userRouter)

export { app };
