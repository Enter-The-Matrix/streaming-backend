import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String, //data type String
      required: true, //always needed
      unique: true, // should be unique in the database
      lowercase: true, // turn the string to lowercase
      trim: true, // remove space from start and end of string
      index: true, // that improves the speed of data retrieval operations
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url,
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url,
    },
    watchHistory: [
      // it been inside an array is equal to the data type array and each element has a below schema
      {
        type: Schema.Types.ObjectId, //the data type when using the other schema
        ref: "Video", //the name of schema to be used
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"], //custom msg when password is not provided
    },
    refreshToken: {
      type: String,
    },
  },

  { timestamps: true }
);

// Pre hooks allow us to execute custom logic before a certain event occurs, such as before saving a
// document to the database. Don't use an arrow function inside this pre hook
// "save" is keyword and "password" also
userSchema.pre("save", async function (next) {
  // This is a Mongoose method that checks if the specified field ("password" in this case) has been modified
  // since the document was loaded from the database.
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// "userSchema.methods" It is a way to add instance methods to a Mongoose schema.
// password here is the password that has came from frontend
// this.password is the one hashed password saved in the database
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// method created to generate a jwt Access Token
// Access Token: they are used to grant access to protected resources and APIs.
// Access tokens usually have a short lifespan
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// method created to generate a jwt Refresh Token
// Refresh Token:They are used to obtain new access tokens once the current access token expires.
// They provide a way to maintain a user's session without requiring them to re-authenticate frequently.
// Refresh tokens have a longer lifespan than access tokens (e.g., days or weeks)
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
