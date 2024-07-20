import multer from "multer";

// Define a storage configuration for multer using diskStorage method.
// 'diskStorage' creates storage engine to save files on disk
const storage = multer.diskStorage({
    // "req" is request fom the client
    // "file" is the file coming from client
    // "cb" is the callback function to be used
    // 'destination' is a function that determines the folder where 
    // uploaded files will be stored.

  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },

   // "filename" is a function that determines the name of the file
  // that will be saved on the server.
  // "req" is the incoming request from the client.
  // "file" is the file object being uploaded from the client.
  // "cb" is the callback function to indicate what the file should be named.
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  // "storage" is the storage configuration for multer
  // It determines how and where the files will be stored.
  storage: storage,
});
