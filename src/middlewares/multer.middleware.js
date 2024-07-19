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
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: storage,
});
